--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: inventory; Type: TABLE; Schema: public; Owner: gauravpandey
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    pname character varying(255),
    color character varying(100),
    dimension character varying(100),
    description text,
    images json
);


ALTER TABLE public.inventory OWNER TO gauravpandey;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: gauravpandey
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_id_seq OWNER TO gauravpandey;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gauravpandey
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: gauravpandey
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: gauravpandey
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: TABLE inventory; Type: ACL; Schema: public; Owner: gauravpandey
--

GRANT ALL ON TABLE public.inventory TO gauravpandey733;


--
-- Name: SEQUENCE inventory_id_seq; Type: ACL; Schema: public; Owner: gauravpandey
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_id_seq TO gauravpandey733;


--
-- PostgreSQL database dump complete
--

