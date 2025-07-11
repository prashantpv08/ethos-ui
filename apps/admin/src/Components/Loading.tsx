import Images from "../Utils/images";

export default function Loading(){
    return(
        <div className="loading">
            <img src={Images.LOADING} alt="Loading" />
        </div>
    )
}