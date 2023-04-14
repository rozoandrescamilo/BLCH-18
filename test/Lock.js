const { expect } = require("chai");

describe("DotrackShipmentStatus", function () {
  let dotrackShipmentStatus;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    const DotrackShipmentStatus = await ethers.getContractFactory("DotrackShipmentStatus");
    [owner, addr1, addr2] = await ethers.getSigners();
    dotrackShipmentStatus = await DotrackShipmentStatus.deploy();
    await dotrackShipmentStatus.deployed();
  });

  it("You must register a new shipment", async function () {
    expect(await dotrackShipmentStatus.registerSH(123))
      .to.emit(dotrackShipmentStatus, "RegisteredStep")
      .withArgs(123, 0, "", owner.address);
  });

  it("You must register a new status for an existing shipment", async function () {
    await dotrackShipmentStatus.registerSH(123);
    expect(await dotrackShipmentStatus.registerStep(123, "Shipment has been confirmed."))
      .to.emit(dotrackShipmentStatus, "RegisteredStep")
      .withArgs(123, 1, "Shipment has been confirmed.", owner.address);
  });

  it("Do not register a new status for a non-existent shipment.", async function () {
    await expect(dotrackShipmentStatus.registerStep(123, "Shipment has been confirmed.")).to.be.revertedWith("This shipment does not exist within the base.");
  });

  it("You should not register more states for a completed shipment", async function () {
    await dotrackShipmentStatus.registerSH(123);
    await dotrackShipmentStatus.registerStep(123, "Shipment has been confirmed.");
    await dotrackShipmentStatus.registerStep(123, "The shipment is in transit.");
    await dotrackShipmentStatus.registerStep(123, "The shipment has arrived at its destination.");
    await dotrackShipmentStatus.registerStep(123, "The shipment has been delivered.");
    await dotrackShipmentStatus.registerStep(123, "The shipment has been completed.");

    await expect(dotrackShipmentStatus.registerStep(123, "The shipment has been completed.")).to.be.revertedWith("This shipment has no more states to register.");
  });

  it("Debe devolver el historial de estados de un envío", async function () {
    await dotrackShipmentStatus.registerSH(123);
    await dotrackShipmentStatus.registerStep(123, "Shipment has been confirmed.");
    await dotrackShipmentStatus.registerStep(123, "The shipment is in transit.");
    await dotrackShipmentStatus.registerStep(123, "The shipment has arrived at its destination.");

    const steps = await dotrackShipmentStatus.SHvalidator(123);
    expect(steps.length).to.equal(4);
    expect(steps[0].status).to.equal(0);
    expect(steps[0].metadata).to.equal("");
    expect(steps[1].status).to.equal(1);
    expect(steps[1].metadata).to.equal("Shipment has been confirmed.");
    expect(steps[2].status).to.equal(2);
    expect(steps[2].metadata).to.equal("The shipment is in transit.");
    expect(steps[3].status).to.equal(3);
    expect(steps[3].metadata).to.equal("The shipment has arrived at its destination.");
  });
});
  