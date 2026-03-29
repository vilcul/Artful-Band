--
-- PostgreSQL database dump
--

\restrict r1jzd9HX7KhwrWs6lGlvgqptr9P4uEcjhxM3avTkwZLloMKwR9Q4o55PdE2aHD8

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(100),
    telefon character varying(15),
    nume character varying(100),
    prenume character varying(100),
    localitate character varying(100),
    data_eveniment date,
    tip_eveniment character varying(100),
    mesaje text
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, email, telefon, nume, prenume, localitate, data_eveniment, tip_eveniment, mesaje) FROM stdin;
1	forcapil@gmail.com	07xxxxxxxx	radu	preradu	stefanesti	2026-01-01	Nunta	Verific daca merge
2	adursca@gmail.com	0709909302	andrei	anghel	prestesti	2027-05-01	Botez	Verific daca merge
3	ab@x.com	0	a	b	aa	2121-12-12	nunta	Merge?
4	pop@gmail.com	0777777777	Oana	Pss	Septaru	2030-12-12	petrecere	Merge?
5	vilculeo697@gmail.com	0780994090	Oana	anume	apa de jos	2028-10-08	botez	Merge?
6	aaa123899@gmail.com	07666633373	plopu	b	paris	2029-10-10	corporate	e ok?
7	vilculeo697@gmail.com	0	Vîlcu	Leonard	Septaru	2033-12-12	corporate	ok??
8	vilculeo697@gmail.com	0777777777	anca	anume	apa de jos	2035-11-10	nunta	merge?
9	aa@gmail.com	07987654321	Vîlcu	Pss	Septaru	2040-12-10	botez	mai merge???
10	pop@gmail.com	0789898989	POP	POP	POPESTI	2044-12-10	nunta	Merge baza de date?
11	dd@gmail.com	0785847382	dan	dragan	Buzau	2026-10-10	corporate	merge?
12	dd@gmail.com	09999999	dan	dd	buzau	2026-12-10	botez	
13	emilp12@gmail.com	078888888	Emil	Prună	Merei	2026-08-12	nunta	Vrem un pachet întreg, cu show de lumini, DJ și atmosferă buna!
14	danutdd@gmail.com	07888888	Danut	Dragan	Buzau	2026-10-10	botez	Avem nevoie de spectacol pe bune!
15	danutdd@gmail.com	0788888	Danut	Dragan	Buzau	2027-10-10	botez	Vrem show pe bune!
16	danutdd@gmail.com	078888888	Danut	Dragan	Buzau	2026-09-09	botez	Vrem pachetul full
17	oanapop@gmail.com	07123456789	Oana	Pop	Peris	2027-10-12	nunta	Vrem pachetul intreg
\.


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 17, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict r1jzd9HX7KhwrWs6lGlvgqptr9P4uEcjhxM3avTkwZLloMKwR9Q4o55PdE2aHD8

