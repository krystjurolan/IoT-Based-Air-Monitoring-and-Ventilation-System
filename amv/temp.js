/*
<section class="section">
        <div class="card">
            <div class="card-body">
                <div class="btn-group dropdown me-1 mb-1">
                    <button type="button" class="btn btn-secondary">Building</button>
                    <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        data-reference="parent">
                        <span class="sr-only" id="selectedBuilding">All Building</span>
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" id="idbuilding-allbuilding">All Building</a>
                        <%# <a class="dropdown-item active" href="#">Option 2</a> %>
                        <div class="dropdown-divider"></div>
                        <% buildings.forEach((building)=> { %>
                            <a class="dropdown-item" href="#" id="idbuilding-<%= building.id %>"><%= building.building_name %></a>   
                        <% }); %>
                    </div>
                </div>
                
                <a href="#" class="btn icon icon-left btn-primary"><i data-feather="edit"></i> Add New Building/Room</a>
            </div>
        </div>

        <section class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-xl-4 col-md-6 col-sm-12" id="room-cards">
                        <% rooms.forEach((room) => { %>
                            <% buildings.forEach((building) => {  if(building.id == room.building_id) { %>
                                <div class="card" id="idbuilding-<%= building.id %>" >
                                    <div class="card-content">
                                        <div class="card-body">
                                            <h4 class="card-title">Room Name: <%= room.room_name %></h4>
                                            <h6 class="card-subtitle">Building:  <%= building.building_name %> </h6>
                                            <h6 class="card-subtitle">Sensor ID: <%= room.device_id %></h6>
                                            <div id="device-<%= room.device_id %>">
                                                <p>Offline or No Sensor ID Match</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer d-flex justify-content-between">
                                        <button class="btn btn-light-primary" data-bs-toggle="modal"
                                        data-bs-target="#modal-<%= room.device_id  %>">Read More</button>
                                    </div>
                                </div>

                                <!--Extra Large Modal -->
                                <div class="modal fade text-left w-100" id="modal-<%= room.device_id  %>" tabindex="-1" role="dialog"
                                    aria-labelledby="myModalLabel16" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl"
                                        role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h4 class="modal-title" id="myModalLabel16">Extra Large Modal</h4>
                                                <button type="button" class="close" data-bs-dismiss="modal"
                                                    aria-label="Close">
                                                    <i data-feather="x"></i>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <h4 class="card-title">Room Name: <%= room.room_name %></h4>
                                                <h6 class="card-subtitle">Building:  <%= building.building_name %> </h6>
                                                <h6 class="card-subtitle">Sensor ID: <%= room.device_id %></h6>
                                                <div id="device-<%= room.device_id %>">
                                                    <canvas id="myChart"></canvas>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-light-secondary"
                                                    data-bs-dismiss="modal">
                                                    <i class="bx bx-x d-block d-sm-none"></i>
                                                    <span class="d-none d-sm-block">Close</span>
                                                </button>
                                                <button type="button" class="btn btn-primary ml-1"
                                                    data-bs-dismiss="modal">
                                                    <i class="bx bx-check d-block d-sm-none"></i>
                                                    <span class="d-none d-sm-block">Accept</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--Modal full size -->
                            <% } }); %>
                        <% }); %>
                        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                        <script src="/socket.io/socket.io.js"></script>
                    </div>
                </div>
            </div>
        </section>
    </section>
    
    <script>
        const socket = io();

        const dropdownBuildingSelected = document.getElementById("selectedBuilding");
        const dropdownBuildingList = document.getElementsByClassName("dropdown-item");
        const roomCards = document.getElementById("room-cards");
    
        for (let i = 0; i < dropdownBuildingList.length; i++) {
            dropdownBuildingList[i].addEventListener('click', function() {
                const buildingId = "" + this.id;
                dropdownBuildingSelected.textContent = this.textContent;
                for (let j = 0; j < roomCards.children.length; j++) {
                    const roomCard = roomCards.children[j];
                    const roomId = roomCard.id;
                    if (dropdownBuildingSelected.textContent === "All Building" || this.id === roomId) {
                        roomCard.style.display = "block";
                    } else {
                        roomCard.style.display = "none";
                    }
                }
             });
        }

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },{
                    label: 'Humidity',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },{
                    label: 'Air Quality',
                    data: [],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        // Listen for data from server
    socket.on('data', (data) => {
      console.log('Data received:', data);
        
      myChart.data.labels.push(new Date().toLocaleTimeString());
        myChart.data.datasets[0].data.push(data.temperature);
        myChart.data.datasets[1].data.push(data.humidity);
        myChart.data.datasets[2].data.push(data.airQuality);
        myChart.update();
        git commit -m "Initially Added Chart.js for Room Monitoring Modals" -m "Added Chart.js to modals in Room Monitoring, but needs polish. Still incomplete"
      

      // Create or update div card for each device
      const cardId = 'device-' + data.device_id;
      let card = document.getElementById(cardId);
    //   if (!card) {
    //     card = document.createElement('div');
    //     card.id = cardId;
    //     card.classList.add('card');
    //     document.getElementById('data-container').appendChild(card);
    //   }
      card.innerHTML = `
        <p> </p>
        <h6><i class="bi bi-thermometer-half"></i> &nbsp Temperature:  ${data.temperature}°C</h6>
        <h6><i class="bi bi-moisture"></i> &nbsp Humidity:  ${data.humidity}%RH</h6>
        <h6><i class="bi bi-wind"></i> &nbsp Air Quality:  ${data.airQuality}ppm</h6>
      `;
    });
    </script>








*/