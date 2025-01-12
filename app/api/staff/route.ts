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
    const {
      data: { user: userData },
      error: userError,
    } = await supabase.auth.admin.getUserByEmail(email);

    if (userError || !userData) {
      console.error("Error finding user:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Found user:", userData.id);

    // Add user to staff_members
    const { error: staffError } = await supabase.from("staff_members").insert([
      {
        id: userData.id,
        full_name: userData.user_metadata?.full_name,
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
      userId: userData.id,
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
