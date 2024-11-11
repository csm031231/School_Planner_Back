PGDMP  +                 
    |            CP    17.0    17.0     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16414    CP    DATABASE     u   CREATE DATABASE "CP" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Korean_Korea.949';
    DROP DATABASE "CP";
                     postgres    false            �            1259    16415    member    TABLE     �   CREATE TABLE public.member (
    id text NOT NULL,
    pwd text NOT NULL,
    name text NOT NULL,
    pwd_confirm text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now()
);
    DROP TABLE public.member;
       public         heap r       postgres    false            �            1259    16420    planner    TABLE     }   CREATE TABLE public.planner (
    date date,
    content text NOT NULL,
    user_id text,
    planner_id integer NOT NULL
);
    DROP TABLE public.planner;
       public         heap r       postgres    false            �            1259    16467    planner_plannerid_seq    SEQUENCE     �   CREATE SEQUENCE public.planner_plannerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.planner_plannerid_seq;
       public               postgres    false    218            �           0    0    planner_plannerid_seq    SEQUENCE OWNED BY     P   ALTER SEQUENCE public.planner_plannerid_seq OWNED BY public.planner.planner_id;
          public               postgres    false    219            '           2604    16468    planner planner_id    DEFAULT     w   ALTER TABLE ONLY public.planner ALTER COLUMN planner_id SET DEFAULT nextval('public.planner_plannerid_seq'::regclass);
 A   ALTER TABLE public.planner ALTER COLUMN planner_id DROP DEFAULT;
       public               postgres    false    219    218            �          0    16415    member 
   TABLE DATA           V   COPY public.member (id, pwd, name, pwd_confirm, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    217   
       �          0    16420    planner 
   TABLE DATA           E   COPY public.planner (date, content, user_id, planner_id) FROM stdin;
    public               postgres    false    218   m       �           0    0    planner_plannerid_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.planner_plannerid_seq', 3, true);
          public               postgres    false    219            )           2606    16428    member member_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.member DROP CONSTRAINT member_pkey;
       public                 postgres    false    217            ,           2606    16470    planner planner_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.planner
    ADD CONSTRAINT planner_pkey PRIMARY KEY (planner_id);
 >   ALTER TABLE ONLY public.planner DROP CONSTRAINT planner_pkey;
       public                 postgres    false    218            *           1259    16454    idx_planner_user_id    INDEX     J   CREATE INDEX idx_planner_user_id ON public.planner USING btree (user_id);
 '   DROP INDEX public.idx_planner_user_id;
       public                 postgres    false    218            -           2606    16448    planner fk_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.planner
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.member(id) ON DELETE CASCADE;
 9   ALTER TABLE ONLY public.planner DROP CONSTRAINT fk_user;
       public               postgres    false    4649    218    217            �   S   x�+I-.1�,�H�����������������������.q��<sKN ��ʃ�0���
V&&V��z�f�Ĺb���� T
"      �   B   x�3202�54"���C#cΒ��CNC.#�TTX(�g`an�i�,�362�Is��qqq �Sq     