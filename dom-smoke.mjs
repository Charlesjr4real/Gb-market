import fs from "node:fs";
import assert from "node:assert/strict";
import { Window } from "happy-dom";

const window = new Window({ url: "http://localhost:4173/#/" });
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8")
  .replace('<script src="app.js"></script>', "");

window.document.write(html);
window.scrollTo = () => {};
window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
window.HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
window.eval(fs.readFileSync(new URL("../app.js", import.meta.url), "utf8"));

const { document } = window;
const click = selector => document.querySelector(selector).click();
const set = (selector, value) => {
  const element = document.querySelector(selector);
  element.value = value;
  element.dispatchEvent(new window.Event("input", { bubbles: true }));
  element.dispatchEvent(new window.Event("change", { bubbles: true }));
};
const go = hash => {
  window.location.hash = hash;
  window.dispatchEvent(new window.HashChangeEvent("hashchange"));
};

assert.match(document.querySelector("h1").textContent, /mais perto/i);
assert.equal(document.querySelectorAll(".product-card").length, 8);

set("#hero-search input", "Samsung");
document.querySelector("#hero-search").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
window.dispatchEvent(new window.HashChangeEvent("hashchange"));
assert.equal(document.querySelectorAll(".product-card").length, 1);
assert.match(document.querySelector(".product-title").textContent, /Samsung/);

go("#/anuncio/p1");
assert.match(document.querySelector(".listing-panel h1").textContent, /Samsung/);
click(".contact-seller");
assert.equal(document.querySelector("#contact-dialog").hasAttribute("open"), true);
click("#simulate-whatsapp");
assert.equal(document.querySelector("#contact-dialog").hasAttribute("open"), false);

go("#/criar");
set("#new-title", "Bicicleta de cidade");
set("#new-category", "Veículos");
set("#new-condition", "Usado");
click('[data-next="2"]');
assert.equal(document.querySelector('[data-step="2"]').classList.contains("active"), true);
set("#new-price", "80000");
set("#new-location", "Bissau");
set("#new-description", "Bicicleta cuidada, pronta a usar e com pneus em bom estado.");
set("#new-phone", "+245 955 000 000");
click('[data-next="3"]');
assert.match(document.querySelector("#review").textContent, /Bicicleta de cidade/);
document.querySelector("#safety-check").checked = true;
document.querySelector("#listing-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
assert.equal(document.querySelector("#success-dialog").hasAttribute("open"), true);
const newId = JSON.parse(window.localStorage.getItem("mercadogb_products"))[0].id;
assert.match(newId, /^user-/);

go(`#/anuncio/${newId}`);
assert.match(document.querySelector(".listing-panel h1").textContent, /Bicicleta de cidade/);
go("#/vendedor");
assert.match(document.querySelector(".seller-list").textContent, /Bicicleta de cidade/);

console.log("DOM smoke tests passed: home, search, filters, listing, WhatsApp demo, publish flow and seller area.");
