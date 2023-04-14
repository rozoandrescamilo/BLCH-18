async function main() {
  const DotrackShipmentStatus = await ethers.getContractFactory("DotrackShipmentStatus");
  const dotrackShipmentStatus = await DotrackShipmentStatus.deploy();
  await dotrackShipmentStatus.deployed();
  console.log("DotrackShipmentStatus Contract deployed0 in the address: ", dotrackShipmentStatus.address);

  // Registra un nuevo envío
  await dotrackShipmentStatus.registerSH(123);
  console.log("Shipment successfully registered.");

  // Registra un nuevo estado para el envío
  await dotrackShipmentStatus.registerStep(123, "The shipment has been confirmed.");
  console.log("Shipment status successfully registered.");

  // Obtener el historial de estados de un envío
  const steps = await dotrackShipmentStatus.SHvalidator(123);
  console.log("Shipment status history:", steps);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
