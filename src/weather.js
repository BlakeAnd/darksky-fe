import React, { Component } from 'react';
import axios from 'axios';
//  

class weather extends Component {
  constructor() {
    super()
    this.state = {
      searchAddress: "",
      latitude: "",
      longitude: ""
    }
  }
  
  componentDidMount() {
    this.getLocation();
  }
  
  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.locationCallback)
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  locationCallback = (location) => {
    this.setLocation(location.coords.latitude, location.coords.longitude);
  }

  setLocation = (lat, lon) => {
    lat = Math.floor(lat*10000)/10000;
    lon = Math.floor(lon*10000)/10000;
    this.setState({
      latitude: lat,
      longitude: lon
    }, () => this.getWeather());
  }

  geocode = () => {
    let address = this.state.searchAddress
    axios
    .get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${address}&outFields=Match_addr,Addr_type`)
    .then(res => {
      if(res.data.candidates[0]){
      this.setLocation(res.data.candidates[0].location.y, res.data.candidates[0].location.x);
      }
    })
    .catch(err => {
      console.log("gecode err", err);
    })
  }

  getWeather = () => {
    let lat = this.state.latitude
    let lon = this.state.longitude
    let coords = {
      lat: lat, 
      lon: lon
    }
    axios
    .get(`http://localhost:9000/weather`, coords)  
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log("weather api err", err);
    })
  }

  handleChange = (event) => {
    this.setState({searchAddress: event.target.value});
  }
  

  handleSubmit = (event) => {
    event.preventDefault();
    this.geocode();
  }

  render() {
    return (
      <div>
        weather app
      <form onSubmit={this.handleSubmit}>
        <label>
          search a location :
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <p>weather results</p>


      </div>
    );
  }
}

//google maps script
// function loadScript(url) {
//   var index = window.document.getElementsByTagName("script")[0]
//   var script = window.document.createElement("script")
//   script.src = url
//   script.async = true
//   script.defer = true
//   index.parentNode.insertBefore(script, index)
// }

// const mapStateToProps = state => ({
//   vehicles: state.vehicles,
//   selected_id: state.selected_id
// })

// export default withRouter(connect(
//   mapStateToProps, { getVehicles }
// )(MapPage))

export default weather;

