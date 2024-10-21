pragma solidity ^0.4.25;

import "./zombieattack.sol";
import "./erc721.sol";
import "./safemath.sol";

contract ZombieOwnership is ZombieAttack, ERC721 {

  using SafeMath for uint256;

  mapping (uint => address) zombieApprovals;

  struct ZombieSale {
  uint price;    
  address seller;
  }

  mapping(uint => ZombieSale) public zombiesForSale;
  uint[] public zombieSaleList;

  event ZombieListedForSale(uint indexed zombieId, uint price, address indexed seller);
  event ZombieSaleCancelled(uint indexed zombieId, address indexed seller);
  event ZombieSold(uint indexed zombieId, uint price, address indexed buyer);


  function listZombieForSale(uint _zombieId, uint _price) external {
      require(_price > 0, "Price must be greater than zero.");
      require(msg.sender == zombieToOwner[_zombieId], "Only the owner can list the zombie for sale.");

      zombiesForSale[_zombieId] = ZombieSale({
          price: _price,
          seller: msg.sender
      });
      zombieSaleList.push(_zombieId); 
      emit ZombieListedForSale(_zombieId, _price, msg.sender);
  }

  function getZombiesOnSale() external view returns (uint[] memory) {
      return zombieSaleList;
  }
  event DebugTransfer(address indexed from, address indexed to, uint256 amount, bool success);

  function buyZombie(uint _zombieId) external payable {
    ZombieSale memory sale = zombiesForSale[_zombieId];
      
    address seller = sale.seller;
    address buyer = msg.sender;

    ownerZombieCount[buyer] = ownerZombieCount[buyer].add(1);
    ownerZombieCount[seller] = ownerZombieCount[seller].sub(1);
    zombieToOwner[_zombieId] = buyer;
    emit Transfer(seller, buyer, _zombieId);

    (bool sent, ) = seller.call.value(msg.value)("");
    emit DebugTransfer(buyer, seller, msg.value, sent);
    require(sent, "Failed to send Ether to the seller.");

    delete zombiesForSale[_zombieId];
      
    _removeZombieFromSaleList(_zombieId);
      
    emit ZombieSold(_zombieId, sale.price, buyer);
}



  function cancelZombieSale(uint _zombieId) external {
      ZombieSale memory sale = zombiesForSale[_zombieId];
      require(sale.seller == msg.sender, "Only the seller can cancel the sale.");

      delete zombiesForSale[_zombieId];
      _removeZombieFromSaleList(_zombieId);
      emit ZombieSaleCancelled(_zombieId, msg.sender);
  }

  function _removeZombieFromSaleList(uint _zombieId) internal {
      for (uint i = 0; i < zombieSaleList.length; i++) {
          if (zombieSaleList[i] == _zombieId) {
              zombieSaleList[i] = zombieSaleList[zombieSaleList.length - 1];
              zombieSaleList.length--;
              break;
          }
      }
  }

  function balanceOf(address _owner) external view returns (uint256) {
    return ownerZombieCount[_owner];
  }

  function ownerOf(uint256 _tokenId) external view returns (address) {
    return zombieToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
    ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
    zombieToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
      require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
      _transfer(_from, _to, _tokenId);
    }

  function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
      zombieApprovals[_tokenId] = _approved;
      emit Approval(msg.sender, _approved, _tokenId);
    }

}
