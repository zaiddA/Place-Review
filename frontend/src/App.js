import React, { useEffect, useState } from "react"
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL,{Marker} from "react-map-gl";
import { Popup } from "react-map-gl";
import { Room,Star } from '@mui/icons-material';
import axios from "axios";

const TOKEN = process.env.REACT_APP_MAPBOX;

function App() {
  const [currentUser,setCurrentUser] = useState(null)
  const [pins,setPins] = useState([])
  const [currentPlaceId,setCurrentPlaceId] = useState(null)
  const [newPlace,setNewPlace] = useState(null)
  const [title,setTitle] = useState(null)
  const [desc,setDesc] = useState(null)
  const [rating,setRating] = useState(null)
  const [viewState, setViewState] = useState({
    longitude: 77,
    latitude: 28,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async ()=>{
      try{
        const res = await axios.get("http://localhost:8900/api/pins")
        setPins(res.data)
      } catch(err){
        console.log(err);
      }
    };
    getPins();
    // axios.get("http://localhost:8900/api/pins")
    // .then((res) => setPins(res.data))
    // .catch((err) => console.log(err))
  },[])
  const handleMarkerClick = (id,lat,long) => {
    setCurrentPlaceId(id)
    setViewState({
      ...viewState,
      latitude :lat,
      longitude :long
    })
  }

  const handleAddClick = (e)=>{
     //const [long,lat] = e.lngLat;
     const long = e.lngLat.lng;
     const lat = e.lngLat.lat;
     console.log(long);
     console.log(lat);
     setNewPlace({
      long:long,
      lat:lat,
     })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin = {
        username:currentUser,
        title:title,
        desc:desc,
        rating:rating,
        lat:newPlace.lat,
        long:newPlace.long,
    }
    // const data = JSON.stringify(newPin);
    // const options = {
    //   method: 'POST',
    //   headers: { 'content-type': 'application/json' },
    //   data,
    //   url: "http://localhost:8900/api/pins" ,
    // };
    // axios(options);
    // axios(options);

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }

    // try {
    //   const res = await axios.post("/pins", newPin);
    //   setPins([...pins, res.data]);
    //   setNewPlace(null);
    // } catch (err) {
    //   console.log(err);
    // }
    // const response = await fetch('/pins',{
    //     method: "POST",
    //     body : JSON.stringify(newPin),
    //     headers:{
    //         'Content-Type' : 'application/json'
    //     }
    // })
    //   const json = await response.json();
    //   console.log(json)
  }

  return (
    <div style={{ height: "100vh", width: "100vw" ,zIndex: 999}}>
      <ReactMapGL
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={TOKEN}
        width="100%"
        height="100%" 
        mapStyle="mapbox://styles/ashutosh-ch/clgolcw4d00g401o1132885dn"
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map(p=>(
        //console.log(p),
        <>
        <Marker 
        longitude={p.long}
        latitude={p.lat}
        >
          <Room 
            style={{
              fontSize: viewState.zoom*5 ,
              color: "tomato",
              cursor: "pointer"
            }}
            onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
          />
        </Marker>
        {p._id === currentPlaceId && 
        <Popup 
        key={p._id}
        longitude={p.long}
        latitude={p.lat}
        closeButton={true}
        closeOnClick={false}
        anchor="left"
        onClose={()=>setCurrentPlaceId(null)}
        >
        <div className="flex flex-col m-2 w-52">
          <label
          className="m-1 text-base mt-2 font-bold text-orange-500"
          >Place</label>
          <h4 className="Place m-1 text-base font-semibold">{p.title}</h4>
          <label
          className="m-1 text-base mt-2 font-bold text-orange-500"
          >Review</label>
          <p className="m-1 text-sm">{p.desc}</p>
          <label
          className="m-1 text-base mt-2 font-bold text-orange-500"
          >Rating</label>
          <div className="stars m-1">
            {Array(p.rating).fill(<Star className="text-yellow-400"/>)}
          </div>
          
          <span className="m-1 mx-1">Created by <b className="text-sm">{p.username}</b></span>
        </div>
        </Popup>
        }
        </>
        ))}
        {newPlace && 
          <Popup 
          longitude={newPlace.long}
          latitude={newPlace.lat}
          anchor="left"
          onClose={()=>setNewPlace(null)}
          >
          <div>
            <form className="flex flex-col m-2 w-52" onSubmit={handleSubmit}>
              <label className="m-1 text-base mt-2 font-bold text-orange-500">Username</label>
              <input  
              className="border-solid border-b-2"
              placeholder="Enter Username" 
              onChange={(e) => setCurrentUser(e.target.value)}
              />
              <label className="m-1 text-base mt-2 font-bold text-orange-500">Title</label>
              <input  
              className="border-solid border-b-2"
              placeholder="Enter a title" 
              onChange={(e) => setTitle(e.target.value)}
              /> 
              <label className="m-1 text-base mt-2 font-bold text-orange-500">Review</label> 
              <textarea  
              className="border-solid border-b-2"
              placeholder="Tell something about this place." 
              onChange={(e) => setDesc(e.target.value)}
              />
              <label className="m-1 text-base mt-2 font-bold text-orange-500">Rating</label>
              <select 
              className="border-solid border-b-2"
              onChange={(e) => setRating(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button 
              className="m-3 h-8 font-bold text-white text-sm tracking-widest bg-orange-400 rounded-md "
              type="submit">Add Pin</button>
            </form>
          </div>
          </Popup>
        }  
      </ReactMapGL>
    </div>
  )
}

export default App;
