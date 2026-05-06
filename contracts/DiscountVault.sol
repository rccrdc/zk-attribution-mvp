// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DiscountVault {
    struct Campaign {
        uint256 id;
        bytes32 secretHash; // In a real ZKP, this would be a verification key, and the proof would be verified using it. For this MVP, we use a simple hash.
        uint256 discountPercentage;
        bool isActive;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public nextCampaignId = 1;

    event CampaignCreated(uint256 indexed campaignId, uint256 discountPercentage);
    event AttributionLogged(uint256 indexed campaignId, address indexed buyer, uint256 originalPrice, uint256 finalPrice);

    function createCampaign(bytes32 _secretHash, uint256 _discountPercentage) external returns (uint256) {
        require(_discountPercentage <= 100, "Discount cannot exceed 100%");
        
        uint256 id = nextCampaignId++;
        campaigns[id] = Campaign({
            id: id,
            secretHash: _secretHash,
            discountPercentage: _discountPercentage,
            isActive: true
        });

        emit CampaignCreated(id, _discountPercentage);
        return id;
    }

    // This function simulates the ZKP verification and the checkout process.
    // The user sends the secret string. The contract hashes it and checks if it matches the campaign's secretHash.
    // In a real ZKP system, the user would send a Proof (bytes) and Public Inputs, and the contract would call a Verifier contract.
    function checkoutWithAttribution(uint256 _campaignId, string calldata _secretProof, uint256 _price) external payable {
        Campaign memory campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");

        // Verify the "ZKP" (in this MVP, we verify the hash preimage)
        bytes32 generatedHash = sha256(abi.encodePacked(_secretProof));
        require(generatedHash == campaign.secretHash, "Invalid attribution proof!");

        // Apply discount
        uint256 discountAmount = (_price * campaign.discountPercentage) / 100;
        uint256 finalPrice = _price - discountAmount;

        // In a real contract, we'd transfer funds here or check msg.value
        // require(msg.value >= finalPrice, "Insufficient funds");

        emit AttributionLogged(_campaignId, msg.sender, _price, finalPrice);
    }
}
