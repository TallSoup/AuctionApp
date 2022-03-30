import React, { useState } from "react";
import Photos from "./Photos";
import BidCount from "./BidCount";
import CurrentBid from "./CurrentBid";
import TimeLeft from "./TimeLeft";
import WinStatus from "./WinStatus";
import Button from "./Button";
import HighBidder from "./HighBidder";

const Item = (props) => {
  let sendBid = () => {
    props.sendBid(props.id);
  };

  //START DATETIME
  const closeDate = new Date(2022, 3, 2, 10, 30, 0);

  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [left, setleft] = useState();

  let currentDate = () => {
    setDate(
      new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  let updateTime = () => {
    setTime(new Date().toLocaleTimeString());
  };

  let timeLeft = () => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    // const year = day * 365;

    let now = new Date().getTime();
    // console.log(now);
    let then = closeDate.getTime();
    // console.log(then);
    let dif = then - now + 20 * 1000 * props.index;
    let daysLeft = Math.floor(dif / day);
    let hoursLeft = Math.floor((dif / hour) % 24);
    let minutesLeft = Math.floor((dif / minute) % 60);
    let secondsLeft = Math.floor((dif / 1000) % 60);

    let timer = `${daysLeft} Days, ${hoursLeft}H:${minutesLeft}M:${secondsLeft}S`;
    // let timer2 = dif.toTimeString();
    setleft(timer);
  };

  setInterval(currentDate, 1000);
  setInterval(updateTime, 1000);
  setInterval(timeLeft, 1000);

  //END DATETIME

  return (
    <div className="container my-2 px-0 d-flex justify-content-center align-items-center col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2">
      <div className="card border-0">
        <Photos img={props.img} title={props.title} />
        <div className="d-flex justify-content-between align-items-center mt-2 px-2">
          <h5>{props.title}</h5>
          <span>
            <BidCount bids={props.bids} />
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center px-2">
          <CurrentBid price={props.price} />
          {/* <WinStatus win={props.win} /> */}
        </div>
        <div>
          <TimeLeft time={left} />
          <HighBidder name={props.highBidder} />
          <Button handleClick={sendBid} />
        </div>
      </div>
    </div>
  );
};

export default Item;
