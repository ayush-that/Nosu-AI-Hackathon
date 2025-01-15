import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get user by email using auth admin API
    const { data, error: userError } = await supabase.auth.admin.listUsers();

    const users = data.users.filter((user) => user.email === email);

    if (userError || !users?.length) {
      console.error("Error finding user:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    console.log("Found user:", user.id);

    // Add user to staff_members
    const { error: staffError } = await supabase.from("staff_members").insert([
      {
        id: user.id,
        full_name: user.user_metadata?.full_name,
        role: "support",
      },
    ]);

    if (staffError) {
      console.error("Error adding staff member:", staffError);
      if (staffError.code === "23505") {
        // unique violation
        return NextResponse.json(
          { error: "User is already a staff member" },
          { status: 400 }
        );
      }
      throw staffError;
    }

    return NextResponse.json({
      message: "Staff member added successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
