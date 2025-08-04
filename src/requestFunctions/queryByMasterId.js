import { logFetchResponse } from "../utils/responseLogger";

const queryByMasterId = async (masterId) => {
  try {
    let req = await fetch(`https://api.discogs.com/masters/${masterId}`);
    let res = await req.json();
    console.log("Successful search for master by id: ");
    console.log(res);

    // Log the response for analysis
    logFetchResponse(`/masters/${masterId}`, res, "album_details");

    return res;
  } catch (error) {
    console.error("Error fetching master by id: ", error);
    throw error;
  }
};

export { queryByMasterId };
