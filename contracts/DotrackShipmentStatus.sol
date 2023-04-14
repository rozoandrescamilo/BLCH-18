// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract DotrackShipmentStatus {
    
    struct Step {
        Status status;
        string metadata; 
    }

    enum Status {
        PO_CONFIRMED, 
        BOOKING_REQUEST, 
        SHIPMENT_IN_TRANSIT, 
        SHIPMENT_AT_DESTINATION,
        CUSTOMS, 
        DELIVERED, 
        COMPLETED 
    }
 
    event RegisteredStep(
        uint256 SHid, 
        Status status, 
        string metadata, 
        address author 
    );

    mapping(uint256 => Step[]) public SHvalidator;


    function registerSH(uint256 SHid) public returns (bool success) {
        require(SHvalidator[SHid].length == 0, "You cannot register this shipment, it is already registered.");
        SHvalidator[SHid].push(Step(Status.PO_CONFIRMED, ""));
        return success;
    }

    function registerStep(uint256 SHid, string calldata metadata) public returns (bool success){
        require(SHvalidator[SHid].length > 0, "This shipment does not exist within the base.");
        Step[] memory stepsArray = SHvalidator[SHid];
        uint256 currentStatus = uint256(stepsArray[stepsArray.length - 1].status) + 1;
        if (currentStatus > uint256(Status.COMPLETED)) {
            revert("This shipment has no more states to register.");
        }
        Step memory step = Step(Status(currentStatus), metadata);
        SHvalidator[SHid].push(step);
        emit RegisteredStep(SHid, Status(currentStatus), metadata, msg.sender);
        success = true;
    }
}