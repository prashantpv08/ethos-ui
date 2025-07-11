import Images from "../Utils/images";

interface Props {
  infoText?: string;
  theme?: "dark" | "light";
  icon?: React.ReactElement | string;
}

export default function Info(props: Props) {
  const { infoText, theme = "dark", icon = Images.INFO_ICON } = props;
  return (
    <div
      className={`reel_theme_info  ${
        theme === "dark" ? "info_dark" : "info_light"
      }`}
    >
      <div className="infoIcon">
        {/* <img src={theme === 'dark' ? icon : Images.INFO_ICON_LIGHT } alt="Info" /> */}
      </div>
      <div className={`infoText`}>
        <p>{infoText}</p>
      </div>
    </div>
  );
}
