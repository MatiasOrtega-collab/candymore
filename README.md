# 🍬 CandyMore - Plataforma Web de Dulcería

Sistema de gestión y procesamiento de pedidos grandes (eventos/abastecimiento) y pequeños (delivery personal).

## 🚀 Arquitectura Multi-Cloud y Ecosistema DevOps

Para responder a las exigencias de alta disponibilidad, automatización y escalabilidad, el proyecto implementa la siguiente arquitectura:

1. **Infraestructura como Código (IaC con Terraform):**
   - **Beneficio:** Permite aprovisionar automáticamente la infraestructura de servidores en AWS mediante scripts declarativos (`iac/main.tf`), evitando la configuración manual en paneles web y garantizando entornos idénticos y reproducibles.

2. **Proceso de Desarrollo DevOps (CI/CD con GitHub Actions):**
   - **Beneficio:** Cada actualización en el código activa un pipeline automatizado (`.github/workflows/deploy.yml`) que valida la sintaxis, instala dependencias y prepara el despliegue, optimizando drásticamente los tiempos de entrega de software.

3. **Integración Multi-Cloud:**
   - **Servidor de Aplicaciones:** Hospedado en **AWS** (Cómputo).
   - **Base de Datos NoSQL:** Gestionada en **MongoDB Atlas** (Persistencia Cloud).
   - **Beneficio:** La separación de proveedores minimiza el riesgo de fallo centralizado (vendor lock-in) y aprovecha lo mejor de cada ecosistema en la nube.

4. **Documentación Interactiva (Swagger / OpenAPI):**
   - **Ubicación:** `/api-docs`
   - **Beneficio:** Expone de forma estandarizada e interactiva las operaciones CRUD de los endpoints (`POST`, `PUT`, `DELETE`), facilitando las pruebas de comunicación entre el Frontend y Backend.