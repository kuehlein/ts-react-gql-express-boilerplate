// import { expect } from "chai";

// import db from "../../index";

// const User = db.model("user");

// describe("User model", () => {
//   beforeEach(() => {
//     return db.sync({ force: true });
//   });

//   describe("instanceMethods", () => {
//     describe("correctPassword", () => {
//       let user;

//       beforeEach(() => {
//         return User.create({
//           email: "johnsmith123@email.com",
//           password: "t@Y2Eld0&X6Qu5%Ggk5pY69z6zI8sZ2w"
//         }).then(newUser => {
//           user = newUser;
//         });
//       });

//       it("returns true if the password is correct", () => {
//         expect(
//           user.correctPassword("t@Y2Eld0&X6Qu5%Ggk5pY69z6zI8sZ2w")
//         ).to.be.equal(true);
//       });

//       it("returns false if the password is incorrect", () => {
//         expect(
//           user.correctPassword("this-is-clearly-not-the-password")
//         ).to.be.equal(false);
//       });
//     }); // end describe('correctPassword')
//   }); // end describe('instanceMethods')
// }); // end describe('User model')
