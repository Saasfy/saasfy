create type "public"."PlanStatus" as enum ('active', 'inactive');

create type "public"."PriceInterval" as enum ('month', 'year');

create type "public"."PriceStatus" as enum ('active', 'inactive');

create type "public"."Role" as enum ('owner', 'member');

create type "public"."StripeStatus" as enum ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

create type "public"."WorkspaceStatus" as enum ('active', 'inactive');

create table "public"."domains" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "slug" text not null,
    "workspace_id" uuid not null,
    "verified" boolean not null default false,
    "primary" boolean not null default false,
    "archived" boolean not null default false,
    "last_checked" timestamp with time zone not null default now()
);


alter table "public"."domains" enable row level security;

create table "public"."plans" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "slug" text not null,
    "description" text,
    "features" text[],
    "status" "PlanStatus" not null default 'active'::"PlanStatus",
    "max_users" numeric not null,
    "max_projects" numeric not null,
    "max_domains" numeric not null,
    "stripe_product_id" text
);


alter table "public"."plans" enable row level security;

create table "public"."prices" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "amount" numeric not null,
    "interval" "PriceInterval" not null,
    "status" "PriceStatus" not null default 'active'::"PriceStatus",
    "plan_id" uuid,
    "stripe_price_id" text
);


alter table "public"."prices" enable row level security;

create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "slug" text not null,
    "name" text not null,
    "description" text,
    "workspace_id" uuid not null
);


alter table "public"."projects" enable row level security;

create table "public"."workspace_invites" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "email" text not null,
    "expires" timestamp with time zone not null,
    "workspace_id" uuid not null
);


alter table "public"."workspace_invites" enable row level security;

create table "public"."workspace_users" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "role" "Role" default 'member'::"Role",
    "workspace_id" uuid,
    "user_id" uuid
);


alter table "public"."workspace_users" enable row level security;

create table "public"."workspaces" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "slug" text not null,
    "name" text not null,
    "description" text,
    "status" "WorkspaceStatus" not null default 'inactive'::"WorkspaceStatus",
    "plan_id" uuid,
    "stripe_customer_id" text,
    "stripe_subscription_id" text,
    "stripe_subscription_status" "StripeStatus"
);


alter table "public"."workspaces" enable row level security;

CREATE INDEX domains_last_checked_idx ON public.domains USING btree (last_checked);

CREATE UNIQUE INDEX domains_pkey ON public.domains USING btree (id);

CREATE UNIQUE INDEX domains_slug_key ON public.domains USING btree (slug);

CREATE INDEX domains_workspace_id_idx ON public.domains USING btree (workspace_id);

CREATE UNIQUE INDEX plans_pkey ON public.plans USING btree (id);

CREATE UNIQUE INDEX plans_slug_key ON public.plans USING btree (slug);

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE INDEX prices_plan_id_idx ON public.prices USING btree (plan_id);

CREATE UNIQUE INDEX prices_stripe_price_id_key ON public.prices USING btree (stripe_price_id);

CREATE INDEX projects_created_at_idx ON public.projects USING btree (created_at);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX projects_slug_key ON public.projects USING btree (slug);

CREATE INDEX projects_workspace_id_idx ON public.projects USING btree (workspace_id);

CREATE INDEX workspace_invites_email_workspace_id_idx ON public.workspace_invites USING btree (email, workspace_id);

CREATE UNIQUE INDEX workspace_invites_pkey ON public.workspace_invites USING btree (id);

CREATE INDEX workspace_invites_workspace_id_idx ON public.workspace_invites USING btree (workspace_id);

CREATE UNIQUE INDEX workspace_users_pkey ON public.workspace_users USING btree (id);

CREATE INDEX workspace_users_user_id_idx ON public.workspace_users USING btree (user_id);

CREATE INDEX workspace_users_workspace_id_idx ON public.workspace_users USING btree (workspace_id);

CREATE UNIQUE INDEX workspaces_pkey ON public.workspaces USING btree (id);

CREATE UNIQUE INDEX workspaces_slug_key ON public.workspaces USING btree (slug);

CREATE UNIQUE INDEX workspaces_stripe_customer_id_key ON public.workspaces USING btree (stripe_customer_id);

CREATE UNIQUE INDEX workspaces_stripe_subscription_id_key ON public.workspaces USING btree (stripe_subscription_id);

alter table "public"."domains" add constraint "domains_pkey" PRIMARY KEY using index "domains_pkey";

alter table "public"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."workspace_invites" add constraint "workspace_invites_pkey" PRIMARY KEY using index "workspace_invites_pkey";

alter table "public"."workspace_users" add constraint "workspace_users_pkey" PRIMARY KEY using index "workspace_users_pkey";

alter table "public"."workspaces" add constraint "workspaces_pkey" PRIMARY KEY using index "workspaces_pkey";

alter table "public"."domains" add constraint "domains_slug_key" UNIQUE using index "domains_slug_key";

alter table "public"."domains" add constraint "public_domains_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE not valid;

alter table "public"."domains" validate constraint "public_domains_workspace_id_fkey";

alter table "public"."plans" add constraint "plans_slug_key" UNIQUE using index "plans_slug_key";

alter table "public"."prices" add constraint "prices_stripe_price_id_key" UNIQUE using index "prices_stripe_price_id_key";

alter table "public"."prices" add constraint "public_prices_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE not valid;

alter table "public"."prices" validate constraint "public_prices_plan_id_fkey";

alter table "public"."projects" add constraint "projects_slug_key" UNIQUE using index "projects_slug_key";

alter table "public"."projects" add constraint "public_projects_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "public_projects_workspace_id_fkey";

alter table "public"."workspace_invites" add constraint "public_workspace_invites_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_invites" validate constraint "public_workspace_invites_workspace_id_fkey";

alter table "public"."workspace_users" add constraint "public_workspace_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_users" validate constraint "public_workspace_users_user_id_fkey";

alter table "public"."workspace_users" add constraint "public_workspace_users_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_users" validate constraint "public_workspace_users_workspace_id_fkey";

alter table "public"."workspaces" add constraint "public_workspaces_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL not valid;

alter table "public"."workspaces" validate constraint "public_workspaces_plan_id_fkey";

alter table "public"."workspaces" add constraint "workspaces_slug_key" UNIQUE using index "workspaces_slug_key";

alter table "public"."workspaces" add constraint "workspaces_stripe_customer_id_key" UNIQUE using index "workspaces_stripe_customer_id_key";

alter table "public"."workspaces" add constraint "workspaces_stripe_subscription_id_key" UNIQUE using index "workspaces_stripe_subscription_id_key";

grant delete on table "public"."domains" to "anon";

grant insert on table "public"."domains" to "anon";

grant references on table "public"."domains" to "anon";

grant select on table "public"."domains" to "anon";

grant trigger on table "public"."domains" to "anon";

grant truncate on table "public"."domains" to "anon";

grant update on table "public"."domains" to "anon";

grant delete on table "public"."domains" to "authenticated";

grant insert on table "public"."domains" to "authenticated";

grant references on table "public"."domains" to "authenticated";

grant select on table "public"."domains" to "authenticated";

grant trigger on table "public"."domains" to "authenticated";

grant truncate on table "public"."domains" to "authenticated";

grant update on table "public"."domains" to "authenticated";

grant delete on table "public"."domains" to "service_role";

grant insert on table "public"."domains" to "service_role";

grant references on table "public"."domains" to "service_role";

grant select on table "public"."domains" to "service_role";

grant trigger on table "public"."domains" to "service_role";

grant truncate on table "public"."domains" to "service_role";

grant update on table "public"."domains" to "service_role";

grant delete on table "public"."plans" to "anon";

grant insert on table "public"."plans" to "anon";

grant references on table "public"."plans" to "anon";

grant select on table "public"."plans" to "anon";

grant trigger on table "public"."plans" to "anon";

grant truncate on table "public"."plans" to "anon";

grant update on table "public"."plans" to "anon";

grant delete on table "public"."plans" to "authenticated";

grant insert on table "public"."plans" to "authenticated";

grant references on table "public"."plans" to "authenticated";

grant select on table "public"."plans" to "authenticated";

grant trigger on table "public"."plans" to "authenticated";

grant truncate on table "public"."plans" to "authenticated";

grant update on table "public"."plans" to "authenticated";

grant delete on table "public"."plans" to "service_role";

grant insert on table "public"."plans" to "service_role";

grant references on table "public"."plans" to "service_role";

grant select on table "public"."plans" to "service_role";

grant trigger on table "public"."plans" to "service_role";

grant truncate on table "public"."plans" to "service_role";

grant update on table "public"."plans" to "service_role";

grant delete on table "public"."prices" to "anon";

grant insert on table "public"."prices" to "anon";

grant references on table "public"."prices" to "anon";

grant select on table "public"."prices" to "anon";

grant trigger on table "public"."prices" to "anon";

grant truncate on table "public"."prices" to "anon";

grant update on table "public"."prices" to "anon";

grant delete on table "public"."prices" to "authenticated";

grant insert on table "public"."prices" to "authenticated";

grant references on table "public"."prices" to "authenticated";

grant select on table "public"."prices" to "authenticated";

grant trigger on table "public"."prices" to "authenticated";

grant truncate on table "public"."prices" to "authenticated";

grant update on table "public"."prices" to "authenticated";

grant delete on table "public"."prices" to "service_role";

grant insert on table "public"."prices" to "service_role";

grant references on table "public"."prices" to "service_role";

grant select on table "public"."prices" to "service_role";

grant trigger on table "public"."prices" to "service_role";

grant truncate on table "public"."prices" to "service_role";

grant update on table "public"."prices" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."workspace_invites" to "anon";

grant insert on table "public"."workspace_invites" to "anon";

grant references on table "public"."workspace_invites" to "anon";

grant select on table "public"."workspace_invites" to "anon";

grant trigger on table "public"."workspace_invites" to "anon";

grant truncate on table "public"."workspace_invites" to "anon";

grant update on table "public"."workspace_invites" to "anon";

grant delete on table "public"."workspace_invites" to "authenticated";

grant insert on table "public"."workspace_invites" to "authenticated";

grant references on table "public"."workspace_invites" to "authenticated";

grant select on table "public"."workspace_invites" to "authenticated";

grant trigger on table "public"."workspace_invites" to "authenticated";

grant truncate on table "public"."workspace_invites" to "authenticated";

grant update on table "public"."workspace_invites" to "authenticated";

grant delete on table "public"."workspace_invites" to "service_role";

grant insert on table "public"."workspace_invites" to "service_role";

grant references on table "public"."workspace_invites" to "service_role";

grant select on table "public"."workspace_invites" to "service_role";

grant trigger on table "public"."workspace_invites" to "service_role";

grant truncate on table "public"."workspace_invites" to "service_role";

grant update on table "public"."workspace_invites" to "service_role";

grant delete on table "public"."workspace_users" to "anon";

grant insert on table "public"."workspace_users" to "anon";

grant references on table "public"."workspace_users" to "anon";

grant select on table "public"."workspace_users" to "anon";

grant trigger on table "public"."workspace_users" to "anon";

grant truncate on table "public"."workspace_users" to "anon";

grant update on table "public"."workspace_users" to "anon";

grant delete on table "public"."workspace_users" to "authenticated";

grant insert on table "public"."workspace_users" to "authenticated";

grant references on table "public"."workspace_users" to "authenticated";

grant select on table "public"."workspace_users" to "authenticated";

grant trigger on table "public"."workspace_users" to "authenticated";

grant truncate on table "public"."workspace_users" to "authenticated";

grant update on table "public"."workspace_users" to "authenticated";

grant delete on table "public"."workspace_users" to "service_role";

grant insert on table "public"."workspace_users" to "service_role";

grant references on table "public"."workspace_users" to "service_role";

grant select on table "public"."workspace_users" to "service_role";

grant trigger on table "public"."workspace_users" to "service_role";

grant truncate on table "public"."workspace_users" to "service_role";

grant update on table "public"."workspace_users" to "service_role";

grant delete on table "public"."workspaces" to "anon";

grant insert on table "public"."workspaces" to "anon";

grant references on table "public"."workspaces" to "anon";

grant select on table "public"."workspaces" to "anon";

grant trigger on table "public"."workspaces" to "anon";

grant truncate on table "public"."workspaces" to "anon";

grant update on table "public"."workspaces" to "anon";

grant delete on table "public"."workspaces" to "authenticated";

grant insert on table "public"."workspaces" to "authenticated";

grant references on table "public"."workspaces" to "authenticated";

grant select on table "public"."workspaces" to "authenticated";

grant trigger on table "public"."workspaces" to "authenticated";

grant truncate on table "public"."workspaces" to "authenticated";

grant update on table "public"."workspaces" to "authenticated";

grant delete on table "public"."workspaces" to "service_role";

grant insert on table "public"."workspaces" to "service_role";

grant references on table "public"."workspaces" to "service_role";

grant select on table "public"."workspaces" to "service_role";

grant trigger on table "public"."workspaces" to "service_role";

grant truncate on table "public"."workspaces" to "service_role";

grant update on table "public"."workspaces" to "service_role";



