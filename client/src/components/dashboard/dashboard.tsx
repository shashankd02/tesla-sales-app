import { useEffect, useState } from "react";
import "./dashboard.css";
import { SERVER_HOST_URL } from "../../utils/constants/constants";

export function Dashboard() {
  const host = SERVER_HOST_URL;

  const [batteryData, setBatteryData] = useState<any[]>([]);
  const [backUpBatteryData, setBackUpBatteryData] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [showBatteryDetails, setShowBatteryDetails] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [totalBatteryQuantity, setTotalBatteryQuantity] = useState<any>();
  const [totalCost, setTotalCost] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${host}/v1/battery`);
      const data = await response.json();
      setBatteryData(data);
      setBackUpBatteryData(JSON.parse(JSON.stringify(data)));
    };
    fetchData();
  }, [host]);

  const resetForm = () => {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
  };

  const reset = () => {
    setShowError(false);
    setSelectedList([]);
    setBatteryData(JSON.parse(JSON.stringify(backUpBatteryData)));
    resetForm();
  };

  const onBatterySelect = (event: any, selectedBattery: any) => {
    setShowBatteryDetails(false);
    const isChecked = event.target.checked;
    const data = [...selectedList];
    if (isChecked) {
      const battery = batteryData.find(
        (item) => item.id === selectedBattery.id
      );
      data.push(battery);
    } else {
      const index = selectedList.findIndex(
        (item) => item.id === selectedBattery.id
      );
      data.splice(index, 1);
    }
    data.sort((a, b) => a.id - b.id);
    setSelectedList([...data]);
  };

  const onQuantityAdd = (event: any, selectedBattery: any) => {
    setShowBatteryDetails(false);
    const quantity = +event.target.value;
    const battery = batteryData.find((item) => item.id === selectedBattery.id);
    battery.quantity = quantity;
    const data = [...batteryData];
    setBatteryData([...data]);
  };

  const displayBatteryInfo = (e: any) => {
    e.preventDefault();
    setShowBatteryDetails(true);

    const totalQuantity = selectedList.reduce((acc, curr) => {
      if (curr.deviceName !== "Transformer") {
        acc += curr.quantity;
      }
      return acc;
    }, 0);
    const transformersRequired =
      totalQuantity >= 4 ? Math.floor(totalQuantity / 4) : 0;
    const isTransformerSelected = selectedList.find(
      (item) => item.id === batteryData[batteryData.length - 1].id
    );
    let data = [...selectedList];
    if (transformersRequired && !isTransformerSelected) {
      const transformer = batteryData[batteryData.length - 1];
      transformer.quantity = transformersRequired;
      data.push(transformer);
    } else if (transformersRequired && isTransformerSelected) {
      data[data.length - 1].quantity += transformersRequired;
    } else if (!transformersRequired && isTransformerSelected) {
      data.splice(data.length - 1, 1);
    }
    setSelectedList([...data]);

    const { quantity, cost } = data.reduce((acc, curr) => {
      if (acc.quantity) {
        acc.quantity += curr.quantity;
      } else {
        acc.quantity = curr.quantity;
      }
      if (acc.cost) {
        acc.cost += +curr.cost.value;
      } else {
        acc.cost = +curr.cost.value;
      }
      return acc;
    }, {});
    setTotalBatteryQuantity(quantity);
    setTotalCost(cost);

    const totalWidth = selectedList.reduce((acc, curr) => {
      if (curr.deviceName !== "Transformer") {
        acc += curr.quantity * curr.landSize.width;
      }
      return acc;
    }, 0);
    if (totalWidth > 100) {
      setSelectedList([]);
      setShowError(true);
      setShowBatteryDetails(false);
    }
  };

  const getBatteryQuantityList = (quantity: string) => {
    return new Array(quantity).fill("1");
  };

  const formatCurrency = (value: any, locale = "en-US", currency = "USD") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  return (
    <div className="dashboard-container">
      <div className="heading text-center">
        <h2>Tesla Energy Sales</h2>
      </div>
      <div className="selection-section">
        <form>
          <div className="row header-row">
            <div className="col-sm-1">
              <h6>#</h6>
            </div>
            <div className="col-sm-3">
              <h6>Battery</h6>
            </div>
            <div className="col-sm-2">
              <h6>Land Size</h6>
            </div>
            <div className="col-sm-1">
              <h6>Energy</h6>
            </div>
            <div className="col-sm-2">
              <h6>Cost</h6>
            </div>
            <div className="col-sm-2">
              <h6>Release Year</h6>
            </div>
            <div className="col-sm-1">
              <h6>Quantity</h6>
            </div>
          </div>
          {batteryData &&
            batteryData.map((item, index) => (
              <div className="row body-row" key={item.id}>
                <div className="col-sm-1">
                  <div className="flex">
                    <div className="form-check flex-item" key={item.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={item.id}
                        disabled={index === batteryData.length - 1}
                        onChange={(e) => onBatterySelect(e, item)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <img
                    className="img-thumbnail"
                    src={"./" + item.imageName}
                    width={70}
                  />
                  <span className="subheading">{item.deviceName}</span>
                </div>
                <div className="col-sm-2">
                  {item.landSize.width} x {item.landSize.depth}{" "}
                  {item.landSize.unit}
                </div>
                <div className="col-sm-1">
                  {item.energy.value} {item.energy.unit}
                </div>
                <div className="col-sm-2">
                  {formatCurrency(item.cost.value)}
                </div>
                <div className="col-sm-2">{item.releaseDate || "-"}</div>
                <div className="col-sm-1">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    onChange={(e) => onQuantityAdd(e, item)}
                    className="form-control"
                    disabled={index === batteryData.length - 1}
                    value={item.quantity}
                  />
                </div>
              </div>
            ))}
          <div className="action-section text-center">
            <button
              type="submit"
              className="btn btn-success action"
              onClick={(e) => displayBatteryInfo(e)}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-warning action"
              onClick={reset}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {showError && (
        <div className="alert alert-danger" role="alert">
          You have selected an invalid combinations related to dimensions /
          quantity. Please reset the form and try again with valid selections.
        </div>
      )}
      {!showError && showBatteryDetails && selectedList.length > 0 && (
        <div>
          <h3 className="text-center">Battery Information</h3>
          <div className="alert alert-info" role="alert">
            For every 4 industrial batteries, 1 transformer is needed
          </div>
        </div>
      )}
      {!showError && showBatteryDetails && selectedList.length > 0 && (
        <div className="row header-row">
          <div className="col-sm-1">
            <h5>#</h5>
          </div>
          <div className="col-sm-4">
            <h5>Battery</h5>
          </div>
          <div className="col-sm-2">
            <h5>Cost</h5>
          </div>
          <div className="col-sm-2">
            <h5>Quantity</h5>
          </div>
          <div className="col-sm-3">
            <h5>Price</h5>
          </div>
        </div>
      )}
      {!showError &&
        showBatteryDetails &&
        selectedList.length > 0 &&
        selectedList.map((item, index) => (
          <div className="row body-row display" key={item.id + "-display"}>
            <div className="col-sm-1">{index + 1}</div>
            <div className="col-sm-4">
              <img
                className="img-thumbnail"
                src={"./" + item.imageName}
                width={100}
              />
              <span className="subheading">{item.deviceName}</span>
            </div>
            <div className="col-sm-2">
              {formatCurrency(item.cost.value)}
            </div>
            <div className="col-sm-2">{item.quantity}</div>
            <div className="col-sm-3">
              {formatCurrency(item.cost.value * item.quantity)}
            </div>
          </div>
        ))}

      {!showError && showBatteryDetails && (
        <div className="row header-row total">
          <div className="col-sm-4 offset-sm-1">
            <h4 className="text-center">Total</h4>
          </div>
          <div className="col-sm-2 offset-sm-2">
            <h5>{totalBatteryQuantity}</h5>
          </div>
          <div className="col-sm-2">
            <h5>{formatCurrency(totalCost)}</h5>
          </div>
        </div>
      )}

      {!showError && showBatteryDetails && (
        <div className="layout">
          {selectedList.length > 0 &&
            selectedList.map((battery) => (
              <div
                className={"layout-section layout-section-" + battery.id}
                key={battery.id + "-layout-section"}
              >
                {getBatteryQuantityList(battery.quantity).map((item, index) => (
                  <div
                    className={"layout-item layout-item-" + battery.id}
                    key={index + "-layout-item"}
                  >
                    {battery.deviceName}
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
