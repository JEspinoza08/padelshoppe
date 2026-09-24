import LegalPage, { LegalList } from "./LegalPage";

export default function About() {
  return (
    <LegalPage
      eyebrow="Sobre nosotros"
      title="Quiénes Somos"
      subtitle="Somos una tienda especializada en pádel, enfocada en asesoría cercana, productos originales y envíos a todo el Perú."
      icon="about"
      sections={[
        { title: "Nuestra propuesta", content: <p>En PadelShop Perú reunimos palas, zapatillas, ropa y accesorios para jugadores que buscan mejorar su rendimiento y comprar con confianza.</p> },
        { title: "Qué nos diferencia", content: <LegalList items={["Asesoría personalizada para elegir el producto correcto.", "Catálogo con marcas reconocidas del mundo del pádel.", "Atención directa por WhatsApp.", "Envíos a Lima y provincias.", "Soporte postventa para cambios, devoluciones y garantías."]} /> },
        { title: "Nuestro compromiso", content: <p>Queremos que cada compra sea clara, segura y rápida, desde la elección del producto hasta la entrega final.</p> },
      ]}
    />
  );
}
