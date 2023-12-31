import { useRef, useState, useEffect } from "react";
import * as React from "react";
// import "mapbox-gl/dist/mapbox-gl.css";
// import "./assets/react.svg";
import "./App.css";
import Map, { Popup, Marker } from "@urbica/react-map-gl";
import.meta.env.MODE;
import mapboxgl from "mapbox-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import { Button, colors } from "@mui/material";
import axios from "axios";
import TimeAgo from "react-timeago";
import Register from "./Components/Register";
import Login from "./Components/Login";

//mapbox token
const TOKEN = import.meta.env.VITE_REACT_APP_MAPBOX;
// mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX;

export default function App() {
  const myStorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [showPin, setShowPin] = useState(null);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 27.173891,
    longitude: 78.042068,
    zoom: 3,
  });
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);
  const handleMarkerClick = (id, lat, long) => {
    setShowPin(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({ long: lng, lat: lat });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("http://localhost:8800/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };

  return (
    <div className="App">
      <Map
        {...viewport}
        key={1}
        style={{
          width: "100%",
          height: "100vh",
        }}
        onDblclick={(e) => currentUser && handleAddClick(e)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        accessToken={TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        doubleClickZoom={false}
        // interactiveLayerIds={ondblclick}
        // transition={(Duration = "200")}
        // transitionDuration="200"
        // projection="equalEarth"
      >
        {pins.map((p) => (
          <>
            <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
              <RoomIcon
                style={{
                  fontSize: viewport.zoom * 10,
                  color: currentUser === p.username ? "tomato" : "blue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === showPin && (
              <Popup
                key={p._id}
                className="Popup"
                longitude={p.long}
                latitude={p.lat}
                anchor="bottom"
                closeButton={true}
                closeOnClick={false}
              >
                <div className="card">
                  <label>place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Creted by <b>{p.username}</b>
                  </span>
                  <span className="date">
                    <TimeAgo date={p.createdAt} />
                  </span>
                </div>
              </Popup>
            )}
            ;
          </>
        ))}
        {newPlace && (
          <>
            <Marker
              longitude={newPlace.long}
              latitude={newPlace.lat}
              anchor="bottom"
            >
              <RoomIcon
                style={{
                  fontSize: viewport.zoom * 10,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              // key={}
              className="Popup"
              longitude={newPlace.long}
              latitude={newPlace.lat}
              anchor="bottom"
              closeButton={true}
              closeOnClick={false}
              // onClose={() => setNewPlace(null)}
            >
              <div className="form">
                <form action="">
                  <label> Title</label>
                  <input
                    type="text"
                    placeholder="Enter a title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label> Review</label>
                  <textarea
                    placeholder="Say us somthing about this place"
                    name=""
                    id=""
                    cols="30"
                    rows="5"
                    onChange={(e) => setDesc(e.target.value)}
                  ></textarea>
                  <label> Rating</label>
                  <select
                    name=""
                    id=""
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className="submitButton" onClick={handleSubmit}>
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {currentUser ? (
          <Button
            variant="contained"
            className="button logout"
            onClick={() => handleLogout()}
          >
            logout
          </Button>
        ) : (
          <div className="buttons">
            <Button
              variant="contained"
              className="button login"
              onClick={() =>
                showLogin ? setShowLogin(false) : setShowLogin(true)
              }
            >
              Login
            </Button>
            <Button
              variant="contained"
              className="button register"
              onClick={() =>
                showRegister ? setShowRegister(false) : setShowRegister(true)
              }
            >
              Register
            </Button>
          </div>
        )}
        {showRegister && <Register />}
        {showLogin && (
          <Login
            setCurrentUser={setCurrentUser}
            setShowLogin={setShowLogin}
            myStorage={myStorage}
          />
        )}
        <Button
          className="userNAME button"
          variant="contained"
          onClick={() =>
            setViewport({
              width: "100vw",
              height: "100vh",
              latitude: 27.173891,
              longitude: 78.042068,
              zoom: 3,
            })
          }
        >
          {myStorage.getItem("user") ? currentUser : "None"}
        </Button>
      </Map>
    </div>
  );
}
// const mapContainer = useRef(null);
// const map = useRef(null);
// const [lng, setLng] = useState(-70.9);
// const [lat, setLat] = useState(42.35);
// const [zoom, setZoom] = useState(9);

// useEffect(() => {
//   if (map.current) return; // initialize map only once
//   map.current = new mapboxgl.Map({
//     container: mapContainer.current,
//     style: "mapbox://styles/mapbox/streets-v12",
//     center: [lng, lat],
//     zoom: zoom,
//     projection: "globe",
//   });

// });
// useEffect(() => {
//   if (!map.current) return; // wait for map to initialize
//   map.current.on("move", () => {
//     setLng(map.current.getCenter().lng.toFixed(4));
//     setLat(map.current.getCenter().lat.toFixed(4));
//     setZoom(map.current.getZoom().toFixed(2));
//   });
// });

// return wala
// <div>
//   <div className="sidebar">
//     Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
//   </div>
//   <div
//     ref={mapContainer}
//     className="map-container"
//     style={{ width: "100%", height: "50vw" }}
//   />
// </div>
