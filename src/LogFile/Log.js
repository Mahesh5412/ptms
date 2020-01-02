import { API } from "../WebServices/RestClient";
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer } from 'react-native-device-info';

export default function log(mode, message) {

  let systemName = DeviceInfo.getSystemName();

  let version = DeviceInfo.getVersion();

  DeviceInfo.getApiLevel().then(apiLevel => {

    DeviceInfo.getDevice().then(device => {

      const logmsgg = message + "     OS Type: "+systemName+ "    App Version: "+version+ "      API Level: "+apiLevel+"       Device Model: "+ device;
    

      console.log("logmsgg                " + logmsgg);

      fetch(API + 'ptmsLog.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            logMessage: logmsgg,
            logMode: mode,

          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          console.log(JSON.stringify(responseJson))
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });


}
