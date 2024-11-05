--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

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
-- Name: member; Type: TABLE; Schema: public; Owner: Zn
--

CREATE TABLE public.member (
    id character(30) NOT NULL,
    pwd character(30) NOT NULL,
    name character(30) NOT NULL
);


ALTER TABLE public.member OWNER TO "Zn";

--
-- Name: planner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planner (
    dates date,
    contents "char"[] NOT NULL
);


ALTER TABLE public.planner OWNER TO postgres;

--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: Zn
--

COPY public.member (id, pwd, name) FROM stdin;
\.


--
-- Data for Name: planner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planner (dates, contents) FROM stdin;
\.


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: Zn
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

