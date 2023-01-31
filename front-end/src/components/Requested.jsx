import React, { useState, useEffect } from "react";
import DisplayRequested from "./DisplayRequested";
import "../css/Requested.css";

const Requested = (props) => {
  const { provider, web3, contract } = props.myWeb3Api;
  const account = props.account;
  const reqArr = [];

  const [requestedList, setRequestedList] = useState([]);
  const [length, setLength] = useState(0);

  useEffect(() => {
    const getRequested = async () => {
      const _indices = await contract.getIndices({ from: account });
      const _reqIndices = _indices[1].words[0];

      for (let i = 0; i < _reqIndices; i++) {
        const reqLand = await contract.getRequestedLands(i, { from: account });

        // if surveyNo. != 0
        if (reqLand[3].words[0] != 0) {
          const landDetails = await contract.getLandDetails(
            reqLand[0],
            reqLand[1],
            reqLand[2],
            reqLand[3].words[0],
            {
              from: account,
            }
          );
          const landLongitudeLatitude = await contract.getLandLongitudeLatitude(
            reqLand[0],
            reqLand[1],
            reqLand[2],
            reqLand[3].words[0],
            {
              from: account,
            }
          );
          console.log(landLongitudeLatitude);

          const longitude = landLongitudeLatitude[0];
          const latitude = landLongitudeLatitude[1];

          const landDetails2 = {
            state: reqLand[0],
            district: reqLand[1],
            city: reqLand[2],
            surveyNo: reqLand[3].words[0],
            longitude,
            latitude,
          };
          let allDetails = { ...landDetails, ...landDetails2 };
          reqArr.push(allDetails);
        }
      }
      setRequestedList(reqArr);
      setLength(reqArr.length);
      console.log(reqArr);
    };

    getRequested();
  }, []);

  return (
    <div className="requested-background d-flex align-items-center justify-content-center">
      <div className="container p-0 m-0">
        {length === 0 ? (
          <div className="no-result-div">
            <p className="no-result">No pending requests.</p>
          </div>
        ) : (
          requestedList.map((details, index) => {
            return (
              <DisplayRequested
                key={index}
                owner={details[0]}
                propertyId={details[1].words[0]}
                index={details[2].words[0]}
                marketValue={details[3].words[0]}
                sqft={details[4].words[0]}
                state={details.state}
                district={details.district}
                city={details.city}
                surveyNo={details.surveyNo}
                longitude={details.longitude}
                latitude={details.latitude}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Requested;
