const Display = ({data, currentIndex}) => {
    
    data.map((piece, index)=>{
        if(piece.type == "master") console.log(piece)
    })

    return(
        <div className="bandDataContainer">
            {/* <img className="artistImage" src={data[currentIndex].cover_image} />
            <h1 className="artistName">{data[currentIndex].title}</h1> */}
        </div>
    )
}

export default Display