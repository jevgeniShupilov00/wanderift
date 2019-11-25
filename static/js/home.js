$(document).ready(function () {
    let searchQuery = JSON.parse(sessionStorage.getItem("searchQuery"));
    app.searchQuery = searchQuery;
});

window.locVal = "";

const app = new Vue({
    el: '#app',
    delimiters: ['{(', ')}'],
    data: {
        searchResultPlaces: [],
        searchLocation: '',
        seatType: 'Economy',
        noOfPassengers: 'Passengers',
        city: '',
        valPassengers: 1,
        searchParameter: '',
        searchQuery: {},
        form: {
            destinationType: "Return",
            noOfPassengers: "Passengers",
            destinationTypeId: 'round',
            seatType: 'Economy',
            valAdults: 1,
            valChildren: 0,
            valInfants: 0
        }
    },
    methods: {
        cityHandler: function () {
            $.ajax({
                url: 'https://aviation-edge.com/v2/public/autocomplete?key=140940-4e6372&city=' + app.city,
                success: function (data) {
                    if (data) {
                        let allData = data;
                        let cityData = JSON.parse(data).cities;
                        let airportData = JSON.parse(data).airportsByCities;

                        cityData.forEach(city =>{
                            city.airport = airportData.pop()
                        });
                        app.searchResultPlaces = cityData;   
                        // app.searchLocation = document.getElementById("addLocation").value                  

                    }
                }
            });
        },
        clearList: function () {
            document.getElementById('mySelectedPlace').style.display = 'block';
        },

        clearPlaceItem: function (index) {
            this.mySelection.splice(index, 1);
        },

        getSelectedRadioValue: function (item, index) {
            console.log(item);
            if (item.checked === true) {
                app.form.stop = item.value;

            }

        },
        setStopOverValue: function (stopOverTo, stopOverFrom) {
            app.form.stopOverFrom = stopOverFrom + ":" + "00";
            app.form.stopOverTo = stopOverTo + ":" + "00";
        },

        search: () => {
            let formData = new FormData;
            app.form.departure_date = document.getElementById('departure_date').value;
            app.form.return_date = document.getElementById('return_date').value;

            if (document.getElementById('stopover') != null) {
                let stopSelected = document.getElementById('stopover').value;
                let chars = stopSelected.split(',');

                let stopOverTo;
                let stopOverFrom;

                if (chars[0].length === 1) {
                    stopOverFrom = "0" + chars[0];
                } else {
                    stopOverFrom = chars[0];
                }

                if (chars[1].length === 1) {
                    stopOverTo = "0" + chars[1];
                } else {
                    stopOverTo = chars[1];
                }

                app.setStopOverValue(stopOverTo, stopOverFrom);
            }

            if (document.getElementsByName("stop") != null) {
                document.getElementsByName("stop").forEach(app.getSelectedRadioValue)
            }


            formData.append("city_from", app.form.placeFrom);
            formData.append("city_to", app.form.placesTo);
            formData.append("dep_date", app.form.departure_date);
            formData.append("ret_date", app.form.return_date);
            formData.append("type", app.form.destinationTypeId);
            formData.append("adults", app.form.valAdults);
            formData.append("infants", app.form.valInfants);
            formData.append("children", app.form.valChildren);
            if (app.form.stop) formData.append("max_stopovers", app.form.stop);
            if (app.form.stopOverFrom) formData.append("stopover_from", app.form.stopOverFrom);
            if (app.form.stopOverTo) formData.append("stopover_to", app.form.stopOverTo);

            let object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });
            let json = object;
            sessionStorage.setItem("searchQuery", JSON.stringify(app.form));

            // The rest of this code assumes you are not using a library.
            // It can be made less wordy if you use one.
            const form = document.createElement('form');
            form.method = "get";
            form.action = "/results";

            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const hiddenField = document.createElement('input');
                    hiddenField.type = 'hidden';
                    hiddenField.name = key;
                    hiddenField.value = json[key];

                    form.appendChild(hiddenField);
                }
            }

            document.body.appendChild(form);
            form.submit();

        },

        swapPlaces: () => {

            let placeFrom = document.getElementById('placesFrom').value;
            let placeTo = document.getElementById('placesTo').value;

            let placeFromId = document.getElementById('placesFrom').placeholder;
            let placeToId = document.getElementById('placesTo').placeholder;

            document.getElementById('placesTo').value = placeFrom;
            document.getElementById('placesFrom').value = placeTo;
            document.getElementById('placesTo').placeholder = placeFromId;
            document.getElementById('placesFrom').placeholder = placeToId;
        },

        setPlace: function (placeName, codeIataCity, index) {
            this.searchResultPlaces.splice(index, 1);
            this.searchResultPlaces = [];
            document.getElementById('mySelectedPlace').innerText = placeName;
            document.getElementById('mySelectedPlace').placeholder = codeIataCity;
            document.getElementById('mySelectedPlace').style.display = 'block';
            
            switch (app.selectionOption) {
                case 1:
                    document.getElementById('placesFrom').value = placeName;
                    app.form.placeFrom = document.getElementById('mySelectedPlace').placeholder;
                    break;
                case 2:
                    document.getElementById('placesTo').value = placeName;
                    app.form.placeTo = document.getElementById('mySelectedPlace').placeholder;
            }
        },

        selectDestType: (type) => {
            switch (type) {
                case 1:
                    app.form.destinationTypeId = 'round';
                    app.form.destinationType = 'Return';
                    return;
                case 2:
                    app.form.destinationTypeId = 'oneway';
                    app.form.destinationType = 'One way';
                    return;
                default:
                    app.form.destinationTypeId = 'round';
                    app.form.destinationType = 'round';
                    return;
            }
        },

        selectSeatType: (type) => {

            switch (type) {
                case 1:
                    document.getElementById('seatType').value = 'Economy';
                    return;
                case 2:
                    document.getElementById('seatType').value = 'Premium Economy';
                    return;
                case 3:
                    document.getElementById('seatType').value = 'Business';
                    return;
                case 4:
                    document.getElementById('seatType').value = 'First Class';
                    return;
                default:
                    document.getElementById('seatType').value = 'Economy';
                    return;
            }
        },
        choosePlaces: function () {
            let place = document.getElementById('mySelectedPlace').innerText;
            let placeId = document.getElementById('mySelectedPlace').placeholder;
            // window.locVal = document.getElementById('addLocation').value;

            switch (app.selectionOption) {
                case 1:
                    document.getElementById('placesFrom').value = place;
                    app.form.placeFrom = placeId;
                    $('#placesModal').modal('hide');
                    return;
                case 2:
                    document.getElementById('placesTo').value = place;
                    app.form.placesTo = placeId;
                    $('#placesModal').modal('hide');
                    return;
            }

        },
        increment: function (index) {

            app.valPassengers = app.form.valAdults + app.form.valChildren + app.form.valInfants;

            if (app.valPassengers !== 9) {

                switch (index) {
                    case 1:

                        if (app.form.valAdults !== 9) {
                            app.form.valAdults++;
                            app.valPassengers++;
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 2:

                        if (app.form.valChildren !== 8) {
                            app.form.valChildren++;
                            app.valPassengers++;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 3:

                        if (app.form.valInfants !== app.form.valAdults) {
                            app.form.valInfants++;
                            app.valPassengers++;
                        } else {
                            document.getElementById('valInfantsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                }
            }

        },

        decrement: function (index) {

            app.valPassengers = app.form.valAdults + app.form.valChildren + app.form.valInfants;

            if (app.valPassengers !== 1) {

                switch (index) {
                    case 1:

                        if (app.form.valAdults !== 1) {
                            app.form.valAdults--;
                            app.valPassengers--;
                            if (app.form.valInfants > app.form.valAdults) {
                                app.valPassengers--;
                                app.form.valInfants--;
                            }
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 2:
                        if (app.form.valChildren !== 0) {
                            app.form.valChildren--;
                            app.valPassengers--;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 3:
                        if (app.form.valInfants !== 0) {
                            app.form.valInfants--;
                            app.valPassengers--;
                        } else {
                            document.getElementById('valInfantsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                }
            }

        },

        sumTotalsPassengers: function () {
            if (app.valPassengers === 1) {
                app.form.noOfPassengers = 'Passengers';
            } else {
                app.form.noOfPassengers = app.valPassengers + ' Passengers'
            }
        },

        openPlaceModal: function (option) {

            app.selectionOption = option;

            // app.city = app.searchLocation;

            let placeFrom = document.getElementById('placesFrom').value;

            let placeTo = document.getElementById('placesTo').value;

            app.city = placeFrom;

            switch (app.selectionOption) {
                case 1:
                    document.getElementById('placesModalTitle').innerText = "Search and Select Departure City";
                    if (placeFrom == null || placeFrom === '') {
                        document.getElementById('mySelectedPlace').style.display = 'none';
                    } else {
                        document.getElementById('mySelectedPlace').style.display = 'block'
                        document.getElementById('mySelectedPlace').innerText = placeFrom;
                    }

                    // document.getElementById('addLocation').innerText = app.searchLocation;
                    // document.getElementById('addLocation').value = app.searchLocation;

                    $('#placesModal').modal('show');                    
                    return;
                case 2:
                    document.getElementById('placesModalTitle').innerText = "Search and Select Arrival City";
                    if (placeTo == null || placeTo === '') {
                        document.getElementById('mySelectedPlace').style.display = 'none';
                    } else {
                        document.getElementById('mySelectedPlace').style.display = 'block';
                        document.getElementById('mySelectedPlace').innerText = placeTo;
                    }
                    $('#placesModal').modal('show');
                    return;
            }

        }
    }
});
