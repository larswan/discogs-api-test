const stringToQuery = (str) => {
    // Capitalize the first letter
    const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);

    // Replace spaces with '+'
    const stringWithoutSpaces = capitalizedStr.replace(/\s+/g, '+');

    // Encode special characters
    const encodedStr = encodeURIComponent(stringWithoutSpaces);

    // console.log("Original string: " + str + " Encoded query: " + encodedStr)
    return encodedStr;
}

export default stringToQuery