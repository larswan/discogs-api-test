const Display = ({ selectedMaster, currentIndex}) => {
    
    // data.map((piece, index)=>{
    //     if(piece.type == "master") console.log(piece)
    // })

    return(
        <div className="bandDataContainer">
            {/* <img className="artistImage" src={selectedMaster.cover_image} /> */}
            <h1 className="artistName">{selectedMaster.title}</h1>
        </div>
    )
}

export default Display