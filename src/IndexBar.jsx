const IndexBar = ({data, selectedIndex, setSelectedIndex}) =>{
    console.log(data)

    return(
        <div className="indexBar">
            {data.map((currentIndex, index) => {
                if (currentIndex.type == "master")
                    return (
                        <div className="indexBox" key={index} onClick={() => { setSelectedIndex(index) }}>{index}</div>
                    )
            })}
        </div>
    )
}

export default IndexBar