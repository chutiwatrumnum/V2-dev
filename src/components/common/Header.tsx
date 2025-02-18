import "../style/common.css";
interface HeaderPropsType {
  title: string;
}

const Header = ({ title }: HeaderPropsType) => {
  return (
    <>
      <div>
        <h1 className="titleHeader">{title}</h1>
      </div>
      <div className="titleHeaderBorder"></div>
    </>
  );
};

export default Header;
