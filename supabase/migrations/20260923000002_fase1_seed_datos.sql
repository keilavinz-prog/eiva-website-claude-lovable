-- Fase 1 · Datos iniciales representativos (aplicada en Supabase el 2026-09-23)
insert into public.company_info (id) values (1);

insert into public.services (slug, title, short_description, icon, category, featured, order_index) values
('instalaciones-baja-tension','Instalaciones Eléctricas de Baja Tensión','Proyectos e instalaciones BT para vivienda, comercio e industria con máxima garantía normativa.','zap','Instalaciones',true,1),
('boletin-electrico-cie','Boletín Eléctrico (CIE)','Tramitación y emisión de certificados de instalación eléctrica ante Industria.','file-check','Certificación',true,2),
('domotica-automatizacion','Domótica y Automatización','Hogares y negocios inteligentes: control de iluminación, climatización y accesos.','home','Automatización',true,3),
('recarga-vehiculo-electrico','Puntos de Recarga para Vehículo Eléctrico','Instalación de cargadores domésticos y para flotas, con gestión de subvenciones.','battery-charging','Movilidad',true,4),
('energia-solar-fotovoltaica','Energía Solar Fotovoltaica','Diseño e instalación de plantas de autoconsumo para vivienda e industria.','sun','Energía',false,5),
('climatizacion','Climatización y Aire Acondicionado','Sistemas de climatización eficientes para cualquier tipo de espacio.','wind','Climatización',false,6),
('iluminacion-led','Iluminación LED y Eficiencia Energética','Renovación de iluminación con ahorro energético certificado.','lightbulb','Eficiencia',false,7),
('telecomunicaciones-ict','Telecomunicaciones e Infraestructuras ICT','Redes de datos, fibra e infraestructuras comunes de telecomunicación.','wifi','Telecomunicaciones',false,8);

insert into public.projects (slug, title, category, location, client_name, power_detail, featured) values
('nave-font-salada','Nave Logística Font Salada','Industrial','Paterna (Valencia)','Font Salada Logística','250 kW instalados',true),
('edificio-turia','Edificio Turia','Residencial','Valencia centro','Comunidad de Propietarios Edificio Turia',null,false),
('restaurante-la-pepica','Restaurante La Pepica','Hostelería','Playa de la Malvarrosa, Valencia','La Pepica S.L.',null,true),
('bodegas-hispano-suizas','Planta Fotovoltaica Bodegas Hispano+Suizas','Energía Solar','Requena (Valencia)',null,'90 kWp',true),
('centro-comercial-bonaire','Ampliación ICT Centro Comercial Bonaire','Comercial','Aldaia (Valencia)',null,null,false),
('vivienda-godella','Vivienda Domotizada Godella','Residencial Premium','Godella (Valencia)',null,null,true),
('parking-colon-recarga','12 Puntos de Recarga VE - Parking Colón','Movilidad Eléctrica','Valencia centro',null,null,false);

insert into public.testimonials (author_name, role_context, content, rating, featured) values
('Marta Solsona','Administradora de Fincas, Comunidad Edificio Turia','EEIVA gestionó todo el boletín eléctrico del edificio sin complicaciones, con plazos claros y trato impecable.',5,true),
('Vicente Ferrando','Gerente, Restaurante La Pepica','Renovaron toda la instalación eléctrica del local en tiempo récord, sin cerrar ni un día de servicio.',5,true),
('Laura Giménez','Propietaria, Vivienda en Godella','La domotización de nuestra casa superó lo esperado. Un equipo muy profesional y cercano.',5,true);

insert into public.team_members (full_name, role_title, order_index) values
('Rafael Ivars','Fundador y Director Técnico',1),
('Amparo Vidal','Directora de Operaciones',2),
('Toni Sanchis','Jefe de Obra e Instalaciones Industriales',3),
('Nuria Beltrán','Responsable de Energía Solar',4),
('Kevin Ortolá','Técnico Especialista en Domótica',5);
