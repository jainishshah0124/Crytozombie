
function openBulkModal() {
    const modal = document.getElementById('bulkCreationModal');
    modal.classList.add('active');
  }
  
  function closeBulkModal() {
    const modal = document.getElementById('bulkCreationModal');
    modal.classList.remove('active');
  }
  
  document.querySelector('.bulkCreationButton').addEventListener('click', openBulkModal);
  document.getElementById('closeBulkModal').addEventListener('click', closeBulkModal);
document.getElementById('addBulkField').addEventListener('click', () => {
    const bulkFieldsContainer = document.getElementById('bulkFieldsContainer');
    const newFieldHTML = `
      <div class="bulk-field mb-4">
        <label>Name:</label>
        <input type="text" name="bulkName" style="color: black;"   class="w-full p-2 border mb-2">
        <label>DNA:</label>
        <input type="text" name="bulkDNA" style="color: black;"  class="w-full p-2 border">
      </div>
    `;
    bulkFieldsContainer.insertAdjacentHTML('beforeend', newFieldHTML);
  });


  async function bulkDelete(selectedIds) {
      try {
        const receipt = await cryptoZombies.methods
            .bulkDeleteZombies(selectedIds)
            .send({ from: userAccount });
        $("#txStatus").text("Zombies Deleted Successfully!");
        getZombiesByOwner(userAccount).then(displayZombies);
    } catch (error) {
      $("#txStatus").text("Error deleting zombies: " + error);
    }
  }
  
  document.getElementById('bulkCreationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const names = [];
    const dnas = [];
    
    document.querySelectorAll('input[name="bulkName"]').forEach(input => names.push(input.value));
    document.querySelectorAll('input[name="bulkDNA"]').forEach(input => dnas.push(input.value));
    
    console.log('Names:', names);
    console.log('DNAs:', dnas);

    for(let i=0;i<dnas.length;i++){
      if(dnas[i].charAt(dnas[i].length-1)!=0 || dnas[i].charAt(dnas[i].length-2)!=0){
        alert('Zombies DNA should always end with 00');
        return;
      }
    }

    const bytes32Names = names.map(stringToBytes32);

    createZombiesInBulk(bytes32Names,dnas);
  
    closeBulkModal();
  });
  function updateCountdown(zombieReadyTime, element, id) {
    function calculateTime() {
      const now = new Date().getTime();
      const readyTime = new Date(zombieReadyTime).getTime();
      const timeRemaining = readyTime - now;

      element.style.marginBottom = "15px";
      if (timeRemaining > 0) {
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        element.innerText = `${minutes} mins and ${seconds} secs to go`;
      } else {
        element.innerHTML = `<button class="fightButton btn bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out" onclick="fightZombie(${id})">Fight Now</button>`;
        clearInterval(timer);
      }
    }
  
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
  }
  async function fightZombie(id) {
    const accounts = await ethereum.enable();
    const otherAccounts = accounts.filter(acc => acc !== userAccount);
    const opponentZombies = await getOpponentZombies(otherAccounts);
    openOpponentModal(opponentZombies,id);
  }
  async function getOpponentZombies(accounts) {
    let zombies = [];
    for (let account of accounts) {
      const zombiesForAccount = await getZombiesByOwner(account);
      zombiesForAccount.forEach(zombie => {
        zombies.push({ owner: account, zombieId: zombie });
      });
    }
    return zombies;
  }
  function openOpponentModal(zombies,ownderzombie) {
    const modal = document.getElementById('opponentFightModal');
    const modalContent = document.getElementById('opponentZombiesContainer');
    modalContent.innerHTML = '';
  
    zombies.forEach(z => {
      getZombieDetails(z.zombieId).then(zombie => {
        let imageUrl = `https://robohash.org/${zombie.dna}?set=set2&size=150x150`;
        const zombieCard = `
          <div class="opponent-zombie-card bg-gray-900 text-gray-200 p-4 rounded-lg shadow-lg transition-all transform hover:scale-105">
            <img src="${imageUrl}" alt="Zombie Avatar" class="zombie-avatar mx-auto mb-4 rounded-full shadow-lg">
            <ul class="text-center space-y-2">
              <li><strong>Name:</strong> ${zombie.name}</li>
              <li><strong>DNA:</strong> ${zombie.dna}</li>
              <li><strong>Level:</strong> ${zombie.level}</li>
            </ul>
            <button class="fightOpponentButton btn bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out" onclick="initiateFight(${ownderzombie}, ${z.zombieId})">
              Fight This Zombie
            </button>
          </div>
        `;
        modalContent.insertAdjacentHTML('beforeend', zombieCard);
      });
    });
  
    modal.classList.add('active-opponent');
  }
  
  
  
  async function initiateFight(initiatorZombieId, opponentZombieId) {
    document.getElementById('fightLoading').style.display = 'flex';
  
    try {
      const receipt = await cryptoZombies.methods.attack(initiatorZombieId, opponentZombieId)
        .send({ from: userAccount });
      
      console.log("Fight transaction receipt:", receipt);
      alert("Fight completed!");
    } catch (error) {
      console.error("Error during fight:", error);
      alert("Fight failed!");
    } finally {
      document.getElementById('fightLoading').style.display = 'none';
      document.getElementById('opponentFightModal').classList.remove('active-opponent');
      getZombiesByOwner(userAccount).then(displayZombies);
    }
  }
  
  
  
  document.getElementById('closeOpponentModal').addEventListener('click', () => {
    document.getElementById('opponentFightModal').classList.remove('active-opponent');
  });




  