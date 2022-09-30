// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../utils/GameOwner.sol";

struct Team {
    address owner;
    address account;
    uint256 tokenId;
}

contract BasketballTeam is ERC721Enumerable, Pausable, GameOwner {
    /*
     * Each team has its own contract address deployed
     * This enables the NFT to actually own the resources and tokens
    */
    mapping (uint => address) teams;

    string private baseURI = "https://sunflower-land.com/play/nfts/team/";

    event TeamCreated(address indexed owner, address indexed landAddress, uint indexed tokenId);

    constructor() ERC721("Sunflower Land", "SL") {
        gameRoles[msg.sender] = true;
    }

    function setBaseUri(string memory uri) public onlyOwner {
        baseURI = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function pause() public onlyOwner {
        return _pause();
    }

    function unpause() public onlyOwner {
        return _unpause();
    }


    function mint(address account) public onlyGame returns (bool){
        uint256 tokenId = totalSupply() + 1;
        _mint(account, tokenId);

        // Create identifiable team contract
        TeamHolder team = new TeamHolder(this, tokenId);
        teams[tokenId] = address(team);

        emit TeamCreated(account, address(team), tokenId);

        return true;
	}

    function gameTransfer(address from, address to, uint256 tokenId) public onlyGame returns (bool){
        _transfer(from, to, tokenId);
        return true;

    }

    function gameApprove(address to, uint256 tokenId) public onlyGame returns (bool) {
        _approve(to, tokenId);
        return true;

    }

    /**
     * DO NOT USE - it will cause overlaps in the ID that gets generated based on the totalSupply
     * Prefer transfer to dead address
     */
    function gameBurn(uint256 tokenId) public onlyGame returns (bool){
        _burn(tokenId);
        return true;
    }
    
    /**
     * Load a team, the owner and its identifiable address (account) on the blockchain
     */
    function getTeam(uint256 tokenId) public view returns (Team memory) {
        address account = teams[tokenId];
        address owner = ownerOf(tokenId);

        return Team({
            account: account,
            owner: owner,
            tokenId: tokenId
        });
    }

    /**
     * Get multiple teams for a single owner
     */
    function getTeams(address account) public view returns (Team[] memory) {
        uint balance = balanceOf(account);

        Team[] memory accountTeams = new Team[](balance);
        for (uint i = 0; i < balance; i++) {
            uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
            accountTeams[i] = Team({
                tokenId: tokenId,
                account: teams[tokenId],
                owner: account
            });
        }

        return accountTeams;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        require(!paused(), "ERC721Pausable: token transfer while paused");
    }
}

contract TeamHolder is ERC165, IERC1155Receiver {
    BasketballTeam private team;
    uint private id;

    constructor(BasketballTeam _team, uint _id) {
        team = _team;
        id = _id;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }

    // Fallback function to help someone accidentally sending eth to this contract
    function withdraw() public {
        require(team.ownerOf(id) == msg.sender, "You are not the owner");
        payable(msg.sender).transfer(address(this).balance);
    }
}