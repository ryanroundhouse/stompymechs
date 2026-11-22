/* ============ STORY: WHERE EVERY THREAD STANDS, OUT OF THE SAVE ============ */
/* storyApply reads the save only for the threads STORY holds when it is called, so it has to come after the last file that adds one. (It used to sit at the end of thread 5, before the campaign
   was defined, and a campaign under way was back at chapter I on every reload.) A new thread file goes in before this one */
storyApply(BOOT);
