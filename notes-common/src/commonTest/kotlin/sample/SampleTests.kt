package sample

import kotlin.test.Test
import kotlin.test.assertTrue

class SampleTests {
    @Test
    fun testMe() {
        hello()
        assertTrue(Sample().checkMe() > 0)
    }
}