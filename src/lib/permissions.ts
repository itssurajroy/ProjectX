
export type Permission =
  | "view_dashboard"
  | "manage_users"
  | "ban_users"
  | "edit_user_xp"
  | "delete_users"
  | "moderate_comments"
  | "delete_comments"
  | "view_reports"
  | "resolve_reports"
  | "create_announcements"
  | "delete_announcements"
  | "manage_anime_requests"
  | "edit_site_settings"
  | "clear_cache"
  | "manage_seo"
  | "view_logs"
  | "manage_social_links"
  | "promote_admins"        // SUPERADMIN ONLY
  | "delete_database"       // SUPERADMIN ONLY
  | "all"; // GOD MODE

// Predefined role templates
export const RolePermissions: Record<string, Permission[]> = {
  superadmin: ["all"],
  admin: [
    "view_dashboard", "manage_users", "ban_users", "edit_user_xp",
    "moderate_comments", "delete_comments", "view_reports", "resolve_reports",
    "create_announcements", "delete_announcements", "manage_anime_requests",
    "edit_site_settings", "clear_cache", "manage_seo", "view_logs", "manage_social_links"
  ],
  moderator: [
    "view_dashboard", "moderate_comments", "delete_comments",
    "view_reports", "resolve_reports", "manage_anime_requests"
  ],
  viewer: [
    "view_dashboard", "view_logs"
  ]
};
