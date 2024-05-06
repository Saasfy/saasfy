create type "public"."InviteStatus" as enum ('pending', 'accepted', 'declined');

alter table "public"."workspace_invites" add column "status" "InviteStatus" not null default 'pending'::"InviteStatus";



