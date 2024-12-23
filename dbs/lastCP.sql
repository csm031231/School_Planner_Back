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
-- Name: member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member (
    id text NOT NULL,
    pwd text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.member OWNER TO postgres;

--
-- Name: planner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planner (
    date date DEFAULT CURRENT_DATE,
    content text NOT NULL,
    user_id text,
    planner_id integer NOT NULL
);


ALTER TABLE public.planner OWNER TO postgres;

--
-- Name: planner_plannerid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.planner_plannerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.planner_plannerid_seq OWNER TO postgres;

--
-- Name: planner_plannerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.planner_plannerid_seq OWNED BY public.planner.planner_id;


--
-- Name: planner planner_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planner ALTER COLUMN planner_id SET DEFAULT nextval('public.planner_plannerid_seq'::regclass);


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.member (id, pwd, name, "createdAt", "updatedAt") FROM stdin;
20232397	11111111	최수민	2024-11-13 19:45:32.886	2024-11-13 19:45:32.886
\.


--
-- Data for Name: planner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planner (date, content, user_id, planner_id) FROM stdin;
2024-11-02	vxcvx	20232397	25
\.


--
-- Name: planner_plannerid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.planner_plannerid_seq', 25, true);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- Name: planner planner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planner
    ADD CONSTRAINT planner_pkey PRIMARY KEY (planner_id);


--
-- Name: idx_planner_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_planner_user_id ON public.planner USING btree (user_id);


--
-- Name: planner fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planner
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.member(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

