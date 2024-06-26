import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrderSummaryFoodCard from "./OrderSummaryFoodCard";
import InlineButtonLoader from "./InlineButtonLoader";
import Loader from "./Loader";
import { toast } from "react-toastify";
import UserReviewCard from "./UserReviewCard";
import RejectOrderModal from "./RejectOrderModal";
// import io from 'socket.io-client';
// const socket = io("http://localhost:4000");

const OrderSummary = () => {
  const { state } = useLocation();
  const [summaryData, setSummaryData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log(state);
      const response = await axios.get(
        `http://localhost:4000/order/fetchOneOrder?id=${state}`
      );
      console.log(response.data.order);

      setSummaryData(response.data.order);
      setLoading(false);
    })();
  }, []);
  // useEffect(() => {
  //   (async () => {
  //     const response = await axios.get(
  //       `http://localhost:4000/resturant/getallreview?id=${summaryData?.customer._id}`
  //     );
  //     console.log(response);
  //     // setReviewData(response.data.order);
  //   })();
  // }, []);

  const handleOrder = async () => {
    setIsDisable(true);
    axios
      .get(`http://localhost:4000/order/acceptOrder?id=${state}`)
      .then((response) => {
        console.log("=====>>>", response);
        if (response?.data?.response) {
          setIsDisable(false);
          toast.success("🔥 Order successfully accepted.");
          setSummaryData(response?.data?.response);
        }
      })
      .catch((e) => {
        console.log("===e", e);
        if (e?.response?.status == 401) {
          toast.error("☹️ " + e?.response?.data?.message);
        }
        setIsDisable(false);
      });
  };

  const handleReject = async () => {
    if (message.trim() == "") {
      toast.error("☹️ Reason must be filled.");
      return;
    } else if (message?.length <= 2) {
      toast.error("☹️ Reason must be longer than 2 characters");
      return;
    }
    setIsValid(true);
    axios
      .get(
        `http://localhost:4000/resturant/rejectorder?id=${state}&fcmToken=${summaryData?.customer?.fcmToken}&reason=${message}&name=${summaryData?.resturant?.name}`
      )
      .then((response) => {
        console.log("=====>>>", response);
        if (response?.data?.response) {
          toast.success(" Order rejected.");
          // setSummaryData(response?.data?.response);
          console.log(response);
          setSummaryData(response.data.response);
          setIsValid(false);
          setMessage(false);
          setIsVisible(false);
        }
      })
      .catch((e) => {
        console.log("===e", e);
        toast.error("☹️ Something went wrong,Please try again");
      });
  };

  let qty = 0;
  if (summaryData != null) {
    summaryData.products.map((product) => (qty += product.quantity));
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="pt-24 bg-gradient-to-bl from-indigo-200 via-red-200 to-yellow-100 ">
          <div className="flex flex-wrap mx-5">
            <div className="w-full sm:w-2/3 p-5">
              <div className="mb-2 shadow-md rounded bg-white bg-opacity-40 p-3">
                <h1 className="text-2xl font-normal capitalize border-b-2 border-black mb-4 pb-2">
                  Customer Details
                </h1>
                <div>
                  <table className="table-auto border-spacing-y-3 border-separate">
                    <tr className="">
                      <td className="text-slate-700 text-lg text-semibold pr-5 w-1/6">
                        Name
                      </td>
                      <td className="text-black capitalize bg-white w-screen bg-opacity-20 pl-2 rounded ">
                        {summaryData != null ? summaryData.customer.name : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-slate-700 text-lg text-semibold pr-5 ">
                        Mobile No.
                      </td>
                      <td className="text-black capitalize bg-white w-full bg-opacity-20 pl-2 rounded">
                        {summaryData != null ? summaryData.customer.number : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-slate-700 text-lg text-semibold pr-5">
                        E-mail
                      </td>
                      <td className="text-black bg-white w-full bg-opacity-20 pl-2 rounded">
                        {summaryData != null ? summaryData.customer.email : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-slate-700 text-lg text-semibold pr-5">
                        Address
                      </td>
                      <td className="text-black capitalize bg-white w-full bg-opacity-20 pl-2 rounded">
                        {summaryData != null
                          ? summaryData.customer.address[0].area +
                            " " +
                            summaryData.customer.address[0].city +
                            " " +
                            summaryData.customer.address[0].state +
                            "-" +
                            summaryData.customer.address[0].pincode
                          : ""}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <div className="shadow-md rounded bg-white bg-opacity-40 p-3 flex flex-wrap gap-2">
                <h1 className="text-2xl w-full font-normal capitalize border-b-2 border-black mb-4 pb-2">
                  Customer order Details
                </h1>
                {summaryData != null ? (
                  summaryData.products.map((product) => (
                    <OrderSummaryFoodCard product={product} />
                  ))
                ) : (
                  <></>
                )}
              </div>
              {summaryData != null && summaryData.courierBoyotpNumber ? (
                <div className="shadow-md rounded bg-white bg-opacity-40 p-3">
                  <h1 className="text-2xl font-normal capitalize border-b-2 border-black mb-4 pb-2">
                    Delivery Boy Details
                  </h1>
                  <div>
                    <table className="table-auto border-spacing-y-3 border-separate">
                      <tr className="">
                        <td className="text-slate-700 text-lg text-semibold pr-5 w-1/6">
                          Name
                        </td>
                        <td className="text-black capitalize bg-white w-screen bg-opacity-20 pl-2 rounded ">
                          {summaryData != null &&
                            summaryData.deliveryBoy != null &&
                            summaryData.deliveryBoy.name}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-slate-700 text-lg text-semibold pr-5 ">
                          Mobile No.
                        </td>
                        <td className="text-black capitalize bg-white w-full bg-opacity-20 pl-2 rounded">
                          {summaryData != null &&
                            summaryData.deliveryBoy != null &&
                            summaryData.deliveryBoy.number}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-slate-700 text-lg text-semibold pr-5">
                          E-mail
                        </td>
                        <td className="text-black bg-white w-full bg-opacity-20 pl-2 rounded">
                          {summaryData != null &&
                            summaryData.deliveryBoy != null &&
                            summaryData.deliveryBoy.email}
                        </td>
                      </tr>
                      {/* <tr>
                        <td className="text-slate-700 text-lg text-semibold pr-5">
                          Address
                        </td>
                        <td className="text-black capitalize bg-white w-full bg-opacity-20 pl-2 rounded">
                          {summaryData != null && summaryData.deliveryBoy != null &&  summaryData.deliveryBoy.address[0].area +
                          " " +
                          summaryData.deliveryBoy.address[0].city +
                          " " +
                          summaryData.deliveryBoy.address[0].state +
                          "-" +
                          summaryData.deliveryBoy.address[0].pincode
                          }
                        </td>
                      </tr> */}
                    </table>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="w-full sm:w-1/3 px-5 sm:p-5">
              <div className="shadow-md rounded h-full bg-white bg-opacity-40 p-3">
                <h1 className="text-2xl font-normal capitalize border-b-2 border-black mb-4 pb-2">
                  Order summary
                </h1>
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-slate-500  text-semibold ">
                        Sub Total
                      </div>
                      <div className="text-slate-800 font-medium capitalize bg-white bg-opacity-20 rounded">
                        {summaryData != null ? "₹" + summaryData.total : ""}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-slate-500  text-semibold">
                        Quantity
                      </div>
                      <div className="text-slate-800 font-medium capitalize bg-white bg-opacity-20 rounded">
                        {qty}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-black">
                      <div className="text-slate-500  text-semibold">
                        Charges
                      </div>
                      <div className="text-slate-800 font-medium capitalize bg-white bg-opacity-20 rounded">
                        0
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-black  text-lg font-semibold text-semibold">
                        Total
                      </div>
                      <div className="text-black text-lg font-semibold capitalize bg-white bg-opacity-20 rounded">
                        {summaryData != null ? "₹" + summaryData.total : 0}
                      </div>
                    </div>
                  </div>
                  <div className="pt-5">
                    {summaryData != null &&
                      summaryData.status === "delivered" && (
                        <>
                          <h2 className="text-lg font-medium my-1">
                            Order Status
                          </h2>

                          <span className="text-xs font-semibold font-mono inline-block py-1 px-2 uppercase rounded text-green-600 bg-green-200 last:mr-0 mr-1">
                            delivered Successfully
                          </span>
                        </>
                      )}
                    {summaryData != null &&
                      summaryData.status === "on the way" && (
                        <>
                          <h2 className="text-lg font-medium my-1">
                            Order Status
                          </h2>
                          <span className="text-xs font-semibold font-mono inline-block py-1 px-2 uppercase rounded text-orange-600 bg-orange-200 last:mr-0 mr-1">
                            On the Way
                          </span>
                        </>
                      )}
                    {summaryData != null &&
                      summaryData.status === "rejected" && (
                        <>
                          <h2 className="text-lg font-medium my-1">
                            Order Status
                          </h2>
                          <span className="text-xs font-semibold font-mono inline-block py-1 px-2 uppercase rounded text-orange-600 bg-orange-200 last:mr-0 mr-1">
                            Order Rejected
                          </span>
                        </>
                      )}
                    {summaryData != null && summaryData.status === "cancel" && (
                      <>
                        <h2 className="text-lg font-medium my-1">
                          Order Status
                        </h2>
                        <span className="text-xs font-semibold font-mono inline-block py-1 px-2 uppercase rounded text-orange-600 bg-orange-200 last:mr-0 mr-1">
                          Order Cancelled
                        </span>
                      </>
                    )}
                    {summaryData != null && summaryData.status === "accept" && (
                      <div>
                        Courier-Boy OTP :
                        <span className="font-semibold text-lg">
                          {" "}
                          {summaryData.courierBoyotpNumber}
                        </span>
                      </div>
                    )}
                    {summaryData != null &&
                      summaryData.status === "process" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={isDisable}
                            className={`${
                              isDisable
                                ? "bg-black"
                                : "hover:bg-white hover:text-black"
                            } w-full bg-black text-white p-2 rounded-lg mt-2   hover:border duration-200 border border-gray-300`}
                            onClick={handleOrder}
                          >
                            {isDisable ? (
                              <InlineButtonLoader />
                            ) : (
                              "Accept Order"
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={isDisable}
                            className={`${
                              isDisable
                                ? "bg-white"
                                : "hover:bg-black hover:text-white"
                            } w-full bg-white text-black p-2 rounded-lg mt-2   hover:border duration-200 border border-gray-300`}
                            onClick={() => setIsVisible(!isVisible)}
                          >
                            {/* {isDisable ? (
                              <InlineButtonLoader />
                            ) : ( */}
                            Reject Order
                            {/* )} */}
                          </button>
                        </div>
                      )}

                    {/* {summaryData !== null && summaryData.courierBoyotpNumber && (
                      loading ? (
                        <InlineButtonLoader />
                      ) : summaryData.status === "delivered" ? (
                        <>
                          <h2 className="text-lg font-medium my-1">
                            Order Status
                          </h2>

                          <span className="text-xs font-semibold font-mono inline-block py-1 px-2 uppercase rounded text-green-600 bg-green-200 last:mr-0 mr-1">
                            delivered Successfully
                          </span>
                        </>
                      ) : summaryData.status === "on the way" ? (
                        <>
                          <h2 className="text-lg font-medium my-1">
                            Order Status
                          </h2>
                          <span className="text-xs font-semibold font-mono inline-block py-1 px-2 uppercase rounded text-orange-600 bg-orange-200 last:mr-0 mr-1">
                            On the Way
                          </span>
                        </>
                      ) 
                          : (
                            
                          )
                    )  */}
                  </div>
                </div>
                {summaryData?.isreviewGiven.forResturant === true ? (
                  <UserReviewCard review={summaryData.resturantReview} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isVisible && (
        <RejectOrderModal
          onClose={() => {
            setIsVisible(false);
            setIsValid(false);
            setMessage("");
          }}
          message={message}
          setMessage={(value) => setMessage(value)}
          onClick={(e) => {
            handleReject(e);
          }}
          isValid={isValid}
        />
      )}
    </>
  );
};

export default OrderSummary;
