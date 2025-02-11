/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

/** Customer of the restaurant. */

class Customer {
  constructor({ id, firstName, lastName, phone, notes, numReservations }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
    this.numReservations = numReservations;
  }

  /** find all customers. */

  static async all() {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes
       FROM customers
       ORDER BY last_name, first_name`
    );
    return results.rows.map((c) => new Customer(c));
  }

  /** get a customer by ID. */

  static async get(id) {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes 
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = results.rows[0];

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }

  static async search(str) {
    const results = await db.query(
      `SELECT id, first_name AS "firstName", last_name AS "lastName", phone, notes 
    FROM customers WHERE first_name ILIKE $1 OR last_name ILIKE $1`,
      [`%${str}%`]
    );
    const customers = results.rows.map((c) => new Customer(c));
    console.log(customers);
    return customers;
  }

  static async getFive(str) {
    const results = await db.query(
      `SELECT id, first_name AS "firstName", last_name AS "lastName" FROM customers WHERE first_name ILIKE $1 OR last_name ILIKE $1 LIMIT 5`,
      [`%${str}%`]
    );
    return results.rows.map((c) => new Customer(c));
  }

  static async bestCustomers() {
    const results = await db.query(`
    SELECT c.id, c.first_name AS "firstName", c.last_name AS "lastName", COUNT(r) AS "numReservations" FROM customers c 
    JOIN reservations r ON r.customer_id = c.id GROUP BY c.id ORDER BY COUNT(r) DESC LIMIT 10`);
    const customers = results.rows.map((c) => new Customer(c));
    return customers;
  }

  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** save this customer. */

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.firstName, this.lastName, this.phone, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers SET first_name=$1, last_name=$2, phone=$3, notes=$4
             WHERE id=$5`,
        [this.firstName, this.lastName, this.phone, this.notes, this.id]
      );
    }
  }
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

module.exports = Customer;
