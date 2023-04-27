        async function loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            const accounts = await window.web3.eth.getAccounts();
            window.currentAccount = accounts[0]
        }
        }

        async function loadContract() {
        // set ABI
        var abi = [{"inputs":[],"name":"getAllLands","outputs":[{"components":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string[]","name":"name","type":"string[]"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"locationURL","type":"string"},{"internalType":"string","name":"propertyDim","type":"string"},{"internalType":"string","name":"imageURL","type":"string"},{"internalType":"address[]","name":"owners","type":"address[]"},{"internalType":"uint256[]","name":"timestamp","type":"uint256[]"}],"internalType":"struct LandRegistry.Land[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_id","type":"string"}],"name":"getLandbyID","outputs":[{"components":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string[]","name":"name","type":"string[]"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"locationURL","type":"string"},{"internalType":"string","name":"propertyDim","type":"string"},{"internalType":"string","name":"imageURL","type":"string"},{"internalType":"address[]","name":"owners","type":"address[]"},{"internalType":"uint256[]","name":"timestamp","type":"uint256[]"}],"internalType":"struct LandRegistry.Land","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_id","type":"string"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_location","type":"string"},{"internalType":"string","name":"_locationURL","type":"string"},{"internalType":"string","name":"_imageURL","type":"string"},{"internalType":"string","name":"_propertyDim","type":"string"}],"name":"registerLand","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_id","type":"string"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"string","name":"_name","type":"string"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // Replace with your ABI

        // set contract address
        var contractAddress = '0x3C3129413D8112B5345CfF61379Ffbf3628402ce';

        return await new window.web3.eth.Contract(abi, contractAddress);
        }


        async function registerLand() {
            try{
                const contract = await loadContract()
                await contract.methods
                .registerLand(
                    document.getElementById("id").value,
                    document.getElementById("name").value,
                    document.getElementById("location").value,
                    document.getElementById("locationURL").value,
                    document.getElementById("imageURL").value,
                    document.getElementById("propertyDim").value,
                )
                .send({ from: window.currentAccount })
                .then(function(receipt){
                    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                });

            }
            catch(error){
                alert("Land Record Already Exist");
            }
        
        }

        async function transferOwnership() {
        const contract = await loadContract()
        await contract.methods
            .transferOwnership(
            document.getElementById("landIDTransfer").value,
            document.getElementById("newOwner").value,
            document.getElementById("newOwnerName").value,
            )
            .send({ from: window.currentAccount })
            .then(function(receipt){
            // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
            });
        }

        async function getLandByID() {
            const contract = await loadContract();
            const landID = document.getElementById("landID").value;
        
            const land = await contract.methods.getLandbyID(landID).call();
        
            // Display the land details on the UI
            const landsList = document.getElementById("landsList");
            landsList.innerHTML = `
            <li>ID: ${land.id}</li>
            <li>Name: ${land.name}</li>
            <li>Location: ${land.location}</li>
            <li>Location URL: ${land.locationURL}</li>
            <li>Image URL: ${land.imageURL}</li>
            <li>Property Dimension: ${land.propertyDim}</li>
            <li>Owners: ${land.owners}</li>
            <li>Timestamp: ${land.timestamp}</li>
            `;
        }
        
        

    
        async function getAllLands() {
        const contract = await loadContract()
        await contract.methods.getAllLands()
            .call({from: window.currentAccount})
            .then(function(result){
            var html = "";
            for (var i = 0; i < result.length; i++) {
                var land = result[i];
                html += "<tr>";
                html += "<td>" + land.id + "</td>";
                html += "<td>" + land.name[land.name.length-1]+ "</td>";
                html += "<td>" + land.location + "</td>";
                html += "<td>" + land.propertyDim + "</td>";
                html += "<td>" + land.imageURL + "</td>";
                html += "</tr>";
            }
            document.getElementById("AlllandsList").innerHTML = html;
            });
        }

        async function load() {
        await loadWeb3();
        window.contract = await loadContract();
        }
        
        load();
