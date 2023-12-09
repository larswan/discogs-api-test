const IndexBar = ({data, selectedIndex, setSelectedIndex}) =>{
    // console.log(data)

    const handleClick = (index) => {

        setSelectedIndex(index)
        console.log(index)
        console.log(data[index])

    }

    return(
        // <div className="indexBar">
        <ul >
            
            {data.map((element, index) => {
                if (element.type == "master")
                return (
                    <li className={`indexBox ${index === selectedIndex ? 'chosenIndex' : ''}`} key={index} onClick={() => { handleClick(index)}}>{element.title}</li>
            )
            })}
        </ul>
        // </div>
    )
}

export default IndexBar