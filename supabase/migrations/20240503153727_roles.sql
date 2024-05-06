alter table "public"."workspace_invites" add column "role" "Role" not null default 'member'::"Role";

alter table "public"."workspace_users" alter column "role" set not null;



