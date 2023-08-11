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
import { colors } from "@mui/material";
import axios from "axios";
import TimeAgo from "react-timeago";

//mapbox token
const TOKEN = import.meta.env.VITE_REACT_APP_MAPBOX;
// mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX;

export default function App() {
  const [pins, setPins] = useState([]);
  const [showPin, setShowPin] = useState(null);
  const [currentUser, SetCurrentUser] = useState("jane");
  const [newPlace, setNewPlace] = useState(null);
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

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 27.173891,
    longitude: 78.042068,
    zoom: 3,
  });
  const handleMarkerClick = (id, lat, long) => {
    setShowPin(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
    // console.log(showpin);
  };
  const handleAddClick = (e) => {
    console.log(e);
    const { lng, lat } = e.lngLat;
    setNewPlace({ long: lng, lat: lat });
    // console.log(e.lngLat, "__long", newPlace.long, " lat-", newPlace.lat);
  };
  return (
    <div className="App">
      <Map
        {...viewport}
        key={1}
        style={{
          width: "100%",
          height: "96vh",
          TransitionEvent: { duration: 400 },
        }}
        onDblclick={(e) => console.log(e)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        accessToken={TOKEN}
        // onClick={(e) => handleAddClick(e)}
        // onClick={(e) => console.log("double clicked", e)}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        doubleClickZoom={false}
        // interactiveLayerIds={ondblclick}
        // transition={(Duration = "200")}
        // transitionDuration="200"
        // onClick={(e) => console.log(e)}
        // projection="equalEarth"
      >
        {pins.map((p) => (
          <>
            {/* {console.log("I'm run!...")} */}
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
            {/* {console.log(p._id === showpin)} */}
            {p._id === showPin && (
              <Popup
                key={p._id}
                className="Popup"
                longitude={p.long}
                latitude={p.lat}
                anchor="bottom"
                closeButton={true}
                closeOnClick={false}
                // onClose={() => console.log(p._id === showPin)}
              >
                {/* {console.log(p.title)} */}
                <div className="card">
                  <label>place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
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
          <Popup
            // key={}
            className="Popup"
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="bottom"
            closeButton={true}
            closeOnClick={false}
            // onClose={() => console.log(p._id === showPin)}
          >
            {/* {console.log(newPlace.long)} */}
            ADD USER
          </Popup>
        )}
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
