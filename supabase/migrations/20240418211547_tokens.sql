create table "public"."tokens" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "hashed" text not null,
    "masked" text not null,
    "user" uuid not null,
    "expires" timestamp with time zone
);


alter table "public"."tokens" enable row level security;

CREATE UNIQUE INDEX tokens_hashed_key ON public.tokens USING btree (hashed);

CREATE UNIQUE INDEX tokens_pkey ON public.tokens USING btree (id);

CREATE INDEX tokens_workspace_user_idx ON public.tokens USING btree ("user");

alter table "public"."tokens" add constraint "tokens_pkey" PRIMARY KEY using index "tokens_pkey";

alter table "public"."tokens" add constraint "public_tokens_user_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) not valid;

alter table "public"."tokens" validate constraint "public_tokens_user_fkey";

alter table "public"."tokens" add constraint "tokens_hashed_key" UNIQUE using index "tokens_hashed_key";

grant delete on table "public"."tokens" to "anon";

grant insert on table "public"."tokens" to "anon";

grant references on table "public"."tokens" to "anon";

grant select on table "public"."tokens" to "anon";

grant trigger on table "public"."tokens" to "anon";

grant truncate on table "public"."tokens" to "anon";

grant update on table "public"."tokens" to "anon";

grant delete on table "public"."tokens" to "authenticated";

grant insert on table "public"."tokens" to "authenticated";

grant references on table "public"."tokens" to "authenticated";

grant select on table "public"."tokens" to "authenticated";

grant trigger on table "public"."tokens" to "authenticated";

grant truncate on table "public"."tokens" to "authenticated";

grant update on table "public"."tokens" to "authenticated";

grant delete on table "public"."tokens" to "service_role";

grant insert on table "public"."tokens" to "service_role";

grant references on table "public"."tokens" to "service_role";

grant select on table "public"."tokens" to "service_role";

grant trigger on table "public"."tokens" to "service_role";

grant truncate on table "public"."tokens" to "service_role";

grant update on table "public"."tokens" to "service_role";



