import { useSearchParams } from "react-router-dom";
import CatalogPage from "./CatalogPage";

export default function Palas() {
  const [searchParams] = useSearchParams();
  const brand = searchParams.get("brand") || "";

  return (
    <CatalogPage
      title={brand ? `Palas ${brand}` : "Palas de pádel"}
      subtitle={
        brand
          ? `Explora productos de la marca ${brand}.`
          : "Encuentra palas para control, potencia y equilibrio según tu nivel de juego."
      }
      category="palas"
      selectedBrand={brand}
    />
  );
}