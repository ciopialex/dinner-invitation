import os
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = "/home/shennyonthebeat/.gemini/antigravity-cli/brain/9835dba0-ca57-4bc7-9f71-79b93dcb1c84"
URL = "http://localhost:4173"

def boxes_overlap(box1, box2):
    return not (
        box1["x"] + box1["width"] < box2["x"] or
        box2["x"] + box2["width"] < box1["x"] or
        box1["y"] + box1["height"] < box2["y"] or
        box2["y"] + box2["height"] < box1["y"]
    )

def run_tests():
    print("🚀 Launching Playwright CLI test suite...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # --- TEST 1: Desktop Initial Viewport & Typography ---
        print("\n[TC-01] Testing Desktop Initial State...")
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(URL)
        page.wait_for_selector("text=One thing I never did for a girl before in my life is learn how to cook.")
        
        # Verify Primary button text
        yes_btn = page.locator("button:has-text(\"Yes, absolutely\")")
        assert yes_btn.is_visible(), "Primary button must be visible with new copy"
        
        # Verify No button text
        no_btn = page.locator("button:has-text(\"No\")")
        assert no_btn.is_visible(), "No button must be visible initially"

        # Check zero em-dashes
        body_text = page.locator("body").inner_text()
        assert "—" not in body_text and "–" not in body_text, "Taste Skill Violation: Em-dashes found on page!"
        print("  ✓ Typography and copy verified (zero em-dashes).")

        initial_shot = os.path.join(ARTIFACT_DIR, "desktop_initial.png")
        page.screenshot(path=initial_shot)
        print(f"  ✓ Initial screenshot saved: {initial_shot}")

        # --- TEST 2: Runaway Evasion Physics & Collision Check ---
        print("\n[TC-02] Testing Evasion Physics and Collision Avoidance...")
        initial_no_box = no_btn.bounding_box()
        initial_yes_box = yes_btn.bounding_box()
        
        # Hover over No button
        no_btn.hover()
        time.sleep(0.4) # Wait for spring physics
        
        evaded_no_box = no_btn.bounding_box()
        current_yes_box = yes_btn.bounding_box()
        
        # Verify position moved
        assert (evaded_no_box["x"] != initial_no_box["x"] or 
                evaded_no_box["y"] != initial_no_box["y"]), "No button failed to evade on hover!"
        print(f"  ✓ Button moved from ({initial_no_box['x']:.1f}, {initial_no_box['y']:.1f}) to ({evaded_no_box['x']:.1f}, {evaded_no_box['y']:.1f})")

        # Verify buttons do NOT overlap
        overlaps = boxes_overlap(evaded_no_box, current_yes_box)
        assert not overlaps, "Collision detected! No button is overlapping or hiding behind Yes button."
        print("  ✓ Collision check passed: 'No' button is cleanly outside 'Yes' button bounding box.")

        # Verify first banter remark
        tooltip = page.locator("text=Are you sure? I hear the dessert is unreal.")
        assert tooltip.is_visible(), "Expected first banter tooltip to appear"
        print("  ✓ Tooltip banter appeared: 'Are you sure? I hear the dessert is unreal.'")

        # --- TEST 3: Multiple Evasions & Fourth-Wall Banter ---
        print("\n[TC-03] Testing Progressive Banter (Fourth-Wall Break)...")
        # Hover multiple times
        for i in range(3):
            no_btn.hover()
            time.sleep(0.3)

        # 4th remark check: "You're smiling right now, aren't you?"
        fourth_wall = page.locator("text=You're smiling right now, aren't you?")
        assert fourth_wall.is_visible(), "4th banter remark 'You're smiling right now, aren't you?' should be visible!"
        print("  ✓ Fourth-wall banter verified: 'You're smiling right now, aren't you?'")

        evasion_shot = os.path.join(ARTIFACT_DIR, "desktop_evasion.png")
        page.screenshot(path=evasion_shot)
        print(f"  ✓ Evasion screenshot saved: {evasion_shot}")

        # --- TEST 4: Mobile Touch Emulation ---
        print("\n[TC-04] Testing Mobile Touch Screen Parity (iPhone 14)...")
        mobile_context = browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True
        )
        mobile_page = mobile_context.new_page()
        mobile_page.goto(URL)
        mobile_page.wait_for_selector("button:has-text(\"Yes, absolutely\")")
        
        mobile_no = mobile_page.locator("button:has-text(\"No\")")
        m_box_before = mobile_no.bounding_box()

        # Simulate 14 consecutive touches to replicate user screenshot condition
        for tap_idx in range(14):
            curr_btn = mobile_page.locator("button:has-text(\"No\"), button:has-text(\"Fine, you win\")")
            box = curr_btn.bounding_box()
            mobile_page.touchscreen.tap(box["x"] + 15, box["y"] + 15)
            time.sleep(0.15)

        # At 14 dodges, button should say 'Fine, you win'
        morphed_btn = mobile_page.locator("button:has-text(\"Fine, you win\")")
        assert morphed_btn.is_visible(), "Button should be morphed to 'Fine, you win' after 14 dodges"
        m_box_after = morphed_btn.bounding_box()
        
        # Verify it is completely within the 390px iPhone screen
        right_edge = m_box_after["x"] + m_box_after["width"]
        assert m_box_after["x"] >= 15, f"Left edge clipped: {m_box_after['x']} < 15"
        assert right_edge <= 375, f"Right edge clipped: {right_edge} > 375"
        print(f"  ✓ 14-dodge mobile test passed: button nicely centered at [{m_box_after['x']:.1f}, {right_edge:.1f}] within 390px.")

        # Check tooltip bounds
        tooltip = mobile_page.locator("text=Okay fine, you win.")
        if tooltip.is_visible():
            t_box = tooltip.bounding_box()
            assert t_box["x"] >= 10 and (t_box["x"] + t_box["width"]) <= 380, "Tooltip clipped on mobile!"
            print(f"  ✓ Tooltip bounded within screen: [{t_box['x']:.1f}, {t_box['x'] + t_box['width']:.1f}]")

        mobile_shot = os.path.join(ARTIFACT_DIR, "mobile_view.png")
        mobile_page.screenshot(path=mobile_shot)
        print(f"  ✓ Mobile 14-dodge screenshot saved: {mobile_shot}")
        mobile_context.close()

        # --- TEST 5: Acceptance & Celebration Flow ---
        print("\n[TC-05] Testing Celebration Flow...")
        yes_btn.click()
        time.sleep(0.5)

        # Check celebration view elements
        page.wait_for_selector("text=A Wise Choice.")
        page.wait_for_selector("text=OFFICIALLY AGREED")
        page.wait_for_selector("text=I won't touch a single stove")
        whatsapp_btn = page.locator("button:has-text(\"Send Confirmation\")")
        assert whatsapp_btn.is_visible(), "WhatsApp confirmation button must be visible"

        celebration_shot = os.path.join(ARTIFACT_DIR, "celebration_view.png")
        page.screenshot(path=celebration_shot)
        print(f"  ✓ Celebration screenshot saved: {celebration_shot}")

        browser.close()
        print("\n🎉 ALL 5 PLAYWRIGHT TEST CASES PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
