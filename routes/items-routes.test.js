process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let cheese = { name: "cheese", price: "1.45" };

beforeEach(function () {
  items.push(cheese);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", function () {
  test("Gets a list of items", async function () {
    const res = await request(app).get(`/items`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [cheese] });
  });
});

describe("GET /items/:name", function () {
  test("Gets a single item", async function () {
    const res = await request(app).get(`/items/${cheese.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(cheese);
  });
  test("responds with 404 if cant find item", async function () {
    const res = await request(app).get(`/items/0`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", function () {
  test("Creates a new item", async function () {
    const res = await request(app).post(`/items`).send({
      name: "taco",
      price: "4.99",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      added: { name: "taco", price: "4.99" },
    });
  });
});

describe("PATCH /items/:name", function () {
  test("Updates a single item", async function () {
    const resp = await request(app).patch(`/items/${cheese.name}`).send({
      name: "lettuce",
      price: "1.29",
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "lettuce", price: "1.29" },
    });
  });

  test("Responds with 404 if id invalid", async function () {
    const resp = await request(app).patch(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", function () {
  test("Deletes a single a item", async function () {
    const resp = await request(app).delete(`/items/${cheese.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ msg: "Deleted" });
  });
});
