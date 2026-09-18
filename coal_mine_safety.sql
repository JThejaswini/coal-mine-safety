--
-- PostgreSQL database dump
--

\restrict 45TLlcJ7W3udo4Kzpx2ro6yC2vug39QQL4ELoaFnZe188lhA5Nxx8KMPjt1V86M

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- Name: corrective_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.corrective_actions (
    id integer NOT NULL,
    violation_id integer NOT NULL,
    assigned_to integer NOT NULL,
    action_description text NOT NULL,
    deadline date,
    status character varying(30) DEFAULT 'Pending'::character varying NOT NULL,
    completed_at timestamp without time zone,
    escalation_level integer DEFAULT 0 NOT NULL,
    escalated_at timestamp without time zone
);


ALTER TABLE public.corrective_actions OWNER TO postgres;

--
-- Name: corrective_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.corrective_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.corrective_actions_id_seq OWNER TO postgres;

--
-- Name: corrective_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.corrective_actions_id_seq OWNED BY public.corrective_actions.id;


--
-- Name: inspections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inspections (
    id integer NOT NULL,
    zone_id integer NOT NULL,
    inspector_id integer NOT NULL,
    inspection_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    helmet_ok boolean NOT NULL,
    gloves_ok boolean NOT NULL,
    goggles_ok boolean NOT NULL,
    equipment_ok boolean NOT NULL,
    environment_ok boolean NOT NULL,
    status character varying(30) NOT NULL
);


ALTER TABLE public.inspections OWNER TO postgres;

--
-- Name: inspections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inspections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inspections_id_seq OWNER TO postgres;

--
-- Name: inspections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inspections_id_seq OWNED BY public.inspections.id;


--
-- Name: mines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mines (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    location character varying(200),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mines OWNER TO postgres;

--
-- Name: mines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mines_id_seq OWNER TO postgres;

--
-- Name: mines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mines_id_seq OWNED BY public.mines.id;


--
-- Name: reinspections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reinspections (
    id integer NOT NULL,
    corrective_action_id integer NOT NULL,
    inspector_id integer NOT NULL,
    inspection_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    result character varying(30) NOT NULL,
    remarks text
);


ALTER TABLE public.reinspections OWNER TO postgres;

--
-- Name: reinspections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reinspections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reinspections_id_seq OWNER TO postgres;

--
-- Name: reinspections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reinspections_id_seq OWNED BY public.reinspections.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    zone_id integer,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: violations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.violations (
    id integer NOT NULL,
    violation_code character varying(30) NOT NULL,
    type character varying(100) NOT NULL,
    zone_id integer NOT NULL,
    inspection_id integer,
    severity character varying(20) NOT NULL,
    status character varying(30) DEFAULT 'Open'::character varying NOT NULL,
    source character varying(50) NOT NULL,
    detected_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.violations OWNER TO postgres;

--
-- Name: violations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.violations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.violations_id_seq OWNER TO postgres;

--
-- Name: violations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.violations_id_seq OWNED BY public.violations.id;


--
-- Name: weather_alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weather_alerts (
    id integer NOT NULL,
    weather_code integer,
    temperature numeric,
    wind_speed numeric,
    risk_level character varying(20) NOT NULL,
    message text NOT NULL,
    sent_to character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.weather_alerts OWNER TO postgres;

--
-- Name: weather_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.weather_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weather_alerts_id_seq OWNER TO postgres;

--
-- Name: weather_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.weather_alerts_id_seq OWNED BY public.weather_alerts.id;


--
-- Name: zones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zones (
    id integer NOT NULL,
    mine_id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.zones OWNER TO postgres;

--
-- Name: zones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zones_id_seq OWNER TO postgres;

--
-- Name: zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zones_id_seq OWNED BY public.zones.id;


--
-- Name: corrective_actions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions ALTER COLUMN id SET DEFAULT nextval('public.corrective_actions_id_seq'::regclass);


--
-- Name: inspections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspections ALTER COLUMN id SET DEFAULT nextval('public.inspections_id_seq'::regclass);


--
-- Name: mines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mines ALTER COLUMN id SET DEFAULT nextval('public.mines_id_seq'::regclass);


--
-- Name: reinspections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reinspections ALTER COLUMN id SET DEFAULT nextval('public.reinspections_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: violations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.violations ALTER COLUMN id SET DEFAULT nextval('public.violations_id_seq'::regclass);


--
-- Name: weather_alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weather_alerts ALTER COLUMN id SET DEFAULT nextval('public.weather_alerts_id_seq'::regclass);


--
-- Name: zones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zones ALTER COLUMN id SET DEFAULT nextval('public.zones_id_seq'::regclass);


--
-- Data for Name: corrective_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.corrective_actions (id, violation_id, assigned_to, action_description, deadline, status, completed_at, escalation_level, escalated_at) FROM stdin;
1	1	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 16:25:23.716986	0	\N
2	2	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 16:34:13.879683	0	\N
3	3	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 16:40:21.895689	0	\N
5	3	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 16:45:44.070036	0	\N
4	2	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 16:45:46.074261	0	\N
6	4	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 16:49:48.584282	0	\N
7	3	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 17:02:46.436105	0	\N
8	5	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 17:15:50.992257	0	\N
12	5	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 17:16:04.126089	0	\N
11	8	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 17:16:26.27206	0	\N
10	7	2	Correct Dust Threshold Exceeded at Entry Checkpoint	2026-09-15	Completed	2026-09-13 17:16:41.366246	0	\N
13	7	2	Correct Dust Threshold Exceeded at Entry Checkpoint	2026-09-15	Completed	2026-09-13 17:16:54.208658	0	\N
9	6	2	Correct No Gloves at Entry Checkpoint	2026-09-15	Completed	2026-09-13 17:21:31.25143	0	\N
14	6	2	Correct No Gloves at Entry Checkpoint	2026-09-15	Completed	2026-09-13 17:21:40.226952	0	\N
15	9	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
16	10	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
17	11	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
19	13	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
20	14	2	Correct No Vest at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
22	16	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
23	17	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
24	18	2	Correct No Gloves at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
25	19	2	Correct No Vest at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
21	15	2	Correct No Vest at Entry Checkpoint	2026-09-15	Completed	2026-09-13 19:37:19.784788	0	\N
18	12	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-13 19:37:24.761551	0	\N
26	20	2	Correct No Gloves at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
27	24	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-15 13:08:38.374368	0	\N
28	15	2	Correct No Vest at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
29	27	2	Correct No Gloves at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
30	26	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-15 13:14:57.833106	0	\N
31	12	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
32	34	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-17 10:57:39.215747	0	\N
33	33	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Completed	2026-09-17 10:58:46.580382	0	\N
34	33	2	Correct No Helmet at Entry Checkpoint	2026-09-15	Pending	\N	0	\N
35	35	9	Correct No Gloves at Zone D	2026-09-15	Pending	\N	0	\N
\.


--
-- Data for Name: inspections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inspections (id, zone_id, inspector_id, inspection_date, helmet_ok, gloves_ok, goggles_ok, equipment_ok, environment_ok, status) FROM stdin;
1	1	3	2026-09-13 17:01:59.41906	f	t	t	t	t	Failed
2	1	3	2026-09-13 17:02:33.960639	t	f	t	t	t	Failed
3	1	3	2026-09-13 17:09:19.003754	t	t	t	t	f	Failed
4	1	3	2026-09-15 13:10:52.934387	f	t	t	t	t	Failed
5	1	3	2026-09-15 13:18:07.073995	t	t	t	f	t	Failed
6	3	3	2026-09-17 07:25:58.462991	t	f	t	t	t	Failed
7	4	3	2026-09-17 07:26:04.826562	t	t	t	t	t	Passed
8	1	3	2026-09-17 10:44:04.926171	t	t	f	t	t	Failed
9	5	3	2026-09-18 07:45:56.683528	t	f	t	t	t	Failed
\.


--
-- Data for Name: mines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mines (id, name, location, created_at) FROM stdin;
1	Demo Coal Mine	Chennai	2026-09-13 16:07:46.858894
\.


--
-- Data for Name: reinspections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reinspections (id, corrective_action_id, inspector_id, inspection_date, result, remarks) FROM stdin;
1	1	2	2026-09-13 16:28:02.485293	Passed	Corrective action verified successfully.
2	1	2	2026-09-13 16:28:09.258258	Passed	Corrective action verified successfully.
3	1	2	2026-09-13 16:30:29.430309	Failed	Corrective action requires additional work.
4	2	2	2026-09-13 16:34:20.284106	Failed	Corrective action requires additional work.
5	3	2	2026-09-13 16:40:26.441501	Failed	Corrective action requires additional work.
6	5	2	2026-09-13 16:47:19.224421	Failed	Corrective action requires additional work.
7	4	2	2026-09-13 16:47:20.147338	Passed	Corrective action verified successfully.
8	6	2	2026-09-13 16:50:12.192275	Passed	Corrective action verified successfully.
9	7	2	2026-09-13 17:16:12.764712	Passed	Corrective action verified successfully.
10	8	2	2026-09-13 17:16:14.186581	Passed	Corrective action verified successfully.
11	12	2	2026-09-13 17:16:15.567878	Passed	Corrective action verified successfully.
12	11	2	2026-09-13 17:16:34.01424	Passed	Corrective action verified successfully.
13	10	2	2026-09-13 17:16:49.542818	Failed	Corrective action requires additional work.
14	13	2	2026-09-13 17:16:57.213734	Passed	Corrective action verified successfully.
15	9	2	2026-09-13 17:21:35.250543	Failed	Corrective action requires additional work.
16	14	2	2026-09-13 17:21:43.683624	Passed	Corrective action verified successfully.
17	27	2	2026-09-15 13:08:54.855708	Passed	Corrective action verified successfully.
18	21	2	2026-09-15 13:08:59.251562	Failed	Corrective action requires additional work.
19	30	2	2026-09-15 13:15:10.972733	Passed	Corrective action verified successfully.
20	18	2	2026-09-15 13:15:16.201194	Failed	Corrective action requires additional work.
21	32	2	2026-09-17 10:58:20.877465	Passed	Corrective action verified successfully.
22	33	2	2026-09-17 10:58:54.074082	Failed	Corrective action requires additional work.
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, created_at, zone_id, is_active) FROM stdin;
2	Test Manager	manager@coalminesafety.com	$2b$10$Qwuwibo8.Myf8D9ReT9v0efGnd3PnGqyZyXkzv7.jOHltGiGplXLe	Mine Manager	2026-09-12 15:01:05.686549	\N	t
3	Safety Officer	safety@coalminesafety.com	$2b$10$A.GQpfu6QaUP9.ZJoRfh/OpQD3aDmBxZ6v1CgAniVAL/wDUuf5arK	Safety Officer	2026-09-13 16:57:45.164026	\N	t
4	Compliance Officer	compliance@coalminesafety.com	$2b$10$A.GQpfu6QaUP9.ZJoRfh/OpQD3aDmBxZ6v1CgAniVAL/wDUuf5arK	Compliance Officer	2026-09-13 16:57:45.164026	\N	t
5	Senior Management	management@coalminesafety.com	$2b$10$A.GQpfu6QaUP9.ZJoRfh/OpQD3aDmBxZ6v1CgAniVAL/wDUuf5arK	Senior Management	2026-09-13 16:57:45.164026	\N	t
6	Area Supervisor A	supervisor.a@coalminesafety.com	$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Area Supervisor	2026-09-18 07:41:08.329602	2	t
7	Area Supervisor B	supervisor.b@coalminesafety.com	$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Area Supervisor	2026-09-18 07:41:08.329602	3	t
8	Area Supervisor C	supervisor.c@coalminesafety.com	$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Area Supervisor	2026-09-18 07:41:08.329602	4	t
9	Area Supervisor D	supervisor.d@coalminesafety.com	$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Area Supervisor	2026-09-18 07:41:08.329602	5	t
\.


--
-- Data for Name: violations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.violations (id, violation_code, type, zone_id, inspection_id, severity, status, source, detected_at) FROM stdin;
1	V-0001	No Helmet	1	\N	High	Resolved	AI CCTV	2026-09-13 16:15:35.146784
2	V-0002	No Helmet	1	\N	High	Resolved	AI CCTV	2026-09-13 16:33:43.883552
4	V-0004	No Helmet	1	\N	High	Resolved	AI CCTV	2026-09-13 16:47:05.049169
3	V-0003	No Helmet	1	\N	High	Resolved	AI CCTV	2026-09-13 16:40:06.97614
5	V-0005	No Helmet	1	1	High	Resolved	Manual Inspection	2026-09-13 17:01:59.427632
8	V-0008	No Helmet	1	\N	High	Resolved	AI CCTV	2026-09-13 17:15:24.353276
7	V-0007	Dust Threshold Exceeded	1	3	Medium	Resolved	Manual Inspection	2026-09-13 17:09:19.03268
6	V-0006	No Gloves	1	2	Medium	Resolved	Manual Inspection	2026-09-13 17:02:33.969434
9	V-0009	No Helmet	1	\N	High	Under Review	AI CCTV	2026-09-13 17:27:51.336892
10	V-0010	No Helmet	1	\N	High	Open	AI CCTV	2026-09-13 18:13:44.321083
11	V-0011	No Helmet	1	\N	High	Open	AI CCTV	2026-09-13 18:14:38.363369
12	V-0012	No Helmet	1	\N	High	Open	AI CCTV	2026-09-13 19:28:11.104277
13	V-0013	No Helmet	1	\N	High	Open	AI CCTV	2026-09-13 19:28:50.989729
14	V-0014	No Vest	1	\N	Medium	Open	AI CCTV	2026-09-13 19:28:52.961214
15	V-0015	No Vest	1	\N	Medium	Open	AI CCTV	2026-09-13 19:29:53.35825
16	V-0016	No Helmet	1	\N	High	Open	AI CCTV	2026-09-13 19:29:55.322093
17	V-0017	No Helmet	1	\N	High	Open	AI CCTV	2026-09-13 19:34:26.74458
18	V-0018	No Gloves	1	\N	Medium	Open	AI CCTV	2026-09-13 19:34:32.711127
19	V-0019	No Vest	1	\N	Medium	Open	AI CCTV	2026-09-13 19:34:38.713489
20	V-0020	No Gloves	1	\N	Medium	Open	AI CCTV	2026-09-13 19:36:15.611037
21	V-0021	No Vest	1	\N	Medium	Open	AI CCTV	2026-09-13 19:36:35.616997
22	V-0022	No Helmet	1	\N	High	Open	AI CCTV	2026-09-13 19:36:39.562785
23	V-0023	No Gloves	1	\N	Medium	Open	AI CCTV	2026-09-15 13:04:08.957786
24	V-0024	No Helmet	1	\N	High	Resolved	AI CCTV	2026-09-15 13:04:30.929487
25	V-0025	No Helmet	1	4	High	Open	Manual Inspection	2026-09-15 13:10:52.954864
27	V-0027	No Gloves	1	\N	Medium	Open	AI CCTV	2026-09-15 13:14:16.223542
26	V-0026	No Helmet	1	\N	High	Resolved	AI CCTV	2026-09-15 13:14:00.190604
28	V-0028	Unsafe Equipment	1	5	High	Open	Manual Inspection	2026-09-15 13:18:07.08542
29	V-0029	No Gloves	3	6	Medium	Open	Manual Inspection	2026-09-17 07:25:58.482224
30	V-0030	No Goggles	1	8	Medium	Open	Manual Inspection	2026-09-17 10:44:04.956302
31	V-0031	No Helmet	1	\N	High	Open	AI CCTV	2026-09-17 10:47:47.903941
32	V-0032	No Gloves	1	\N	Medium	Open	AI CCTV	2026-09-17 10:47:53.754987
33	V-0033	No Helmet	1	\N	High	Open	AI CCTV	2026-09-17 10:48:19.785239
34	V-0034	No Helmet	1	\N	High	Resolved	AI CCTV	2026-09-17 10:49:15.092866
35	V-0035	No Gloves	5	9	Medium	Open	Manual Inspection	2026-09-18 07:45:56.712548
\.


--
-- Data for Name: weather_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weather_alerts (id, weather_code, temperature, wind_speed, risk_level, message, sent_to, created_at) FROM stdin;
\.


--
-- Data for Name: zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zones (id, mine_id, name, created_at) FROM stdin;
1	1	Entry Checkpoint	2026-09-13 16:10:14.20143
2	1	Zone A	2026-09-17 07:24:32.272762
3	1	Zone B	2026-09-17 07:24:32.272762
4	1	Zone C	2026-09-17 07:24:32.272762
5	1	Zone D	2026-09-17 07:24:32.272762
\.


--
-- Name: corrective_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.corrective_actions_id_seq', 35, true);


--
-- Name: inspections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inspections_id_seq', 9, true);


--
-- Name: mines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mines_id_seq', 1, true);


--
-- Name: reinspections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reinspections_id_seq', 22, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: violations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.violations_id_seq', 35, true);


--
-- Name: weather_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.weather_alerts_id_seq', 1, false);


--
-- Name: zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zones_id_seq', 5, true);


--
-- Name: corrective_actions corrective_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_pkey PRIMARY KEY (id);


--
-- Name: inspections inspections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT inspections_pkey PRIMARY KEY (id);


--
-- Name: mines mines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mines
    ADD CONSTRAINT mines_pkey PRIMARY KEY (id);


--
-- Name: reinspections reinspections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reinspections
    ADD CONSTRAINT reinspections_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: violations violations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.violations
    ADD CONSTRAINT violations_pkey PRIMARY KEY (id);


--
-- Name: violations violations_violation_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.violations
    ADD CONSTRAINT violations_violation_code_key UNIQUE (violation_code);


--
-- Name: weather_alerts weather_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weather_alerts
    ADD CONSTRAINT weather_alerts_pkey PRIMARY KEY (id);


--
-- Name: zones zones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_pkey PRIMARY KEY (id);


--
-- Name: corrective_actions corrective_actions_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: corrective_actions corrective_actions_violation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_violation_id_fkey FOREIGN KEY (violation_id) REFERENCES public.violations(id) ON DELETE CASCADE;


--
-- Name: inspections inspections_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT inspections_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.users(id);


--
-- Name: inspections inspections_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT inspections_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id);


--
-- Name: reinspections reinspections_corrective_action_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reinspections
    ADD CONSTRAINT reinspections_corrective_action_id_fkey FOREIGN KEY (corrective_action_id) REFERENCES public.corrective_actions(id) ON DELETE CASCADE;


--
-- Name: reinspections reinspections_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reinspections
    ADD CONSTRAINT reinspections_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.users(id);


--
-- Name: users users_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id);


--
-- Name: violations violations_inspection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.violations
    ADD CONSTRAINT violations_inspection_id_fkey FOREIGN KEY (inspection_id) REFERENCES public.inspections(id);


--
-- Name: violations violations_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.violations
    ADD CONSTRAINT violations_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id);


--
-- Name: zones zones_mine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_mine_id_fkey FOREIGN KEY (mine_id) REFERENCES public.mines(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 45TLlcJ7W3udo4Kzpx2ro6yC2vug39QQL4ELoaFnZe188lhA5Nxx8KMPjt1V86M

