var Conference = Conference || {};

Conference.dataContext = (function ($) {
    "use strict";

    var db = null;
    var processorFunc = null;
    var id;
    var DATABASE_NAME = 'conference_db';
    // Use OLD_DATABASE_VERSION when upgrading databases. It indicates
    // the version we can upgrade from. Anything older and we tell the user
    // there's a problem
    var OLD_DATABASE_VERSION = "0";
    // The current database version supported by this script
    var DATABASE_VERSION = "1.0";

    var populateDB = function (tx) {

        // There is much more here than we need for the assignment. We only need sessions and days
        tx.executeSql('CREATE TABLE days (_id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT NOT NULL, date TEXT)', [], createSuccess, errorDB);
        tx.executeSql('CREATE TABLE talks (_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, speaker TEXT, image TEXT, description TEXT, notes TEXT, eventid INTEGER NOT NULL)', [], createSuccess, errorDB);
        tx.executeSql('CREATE TABLE venues (_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, latitude TEXT, longitude TEXT)', [], createSuccess, errorDB);
        tx.executeSql('CREATE TABLE sessions (_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, starttime TEXT, endtime TEXT, type TEXT, dayid INTEGER NOT NULL)', [], createSuccess, errorDB);
        tx.executeSql('CREATE TABLE events (_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, venueid INTEGER NOT NULL, sessionid INTEGER NOT NULL)', [], createSuccess, errorDB);

        tx.executeSql('insert into days (_id, day, date) values (1,	\'Wednesday\', \'8th Sept\')', [], insertSuccess, errorDB);
        tx.executeSql('insert into days (_id, day, date) values (2,	\'Thursday\',	\'9th Sept\' )', [], insertSuccess, errorDB);
        tx.executeSql('insert into days (_id, day, date) values (3,	\'Friday\',	\'10th Sept\' )', [], insertSuccess, errorDB);

        tx.executeSql('insert into sessions (_id, title, startTime, endtime, type, dayId) values (1,  \'OPENING CEREMONY\',     \'09:00\', \'09:30\', \'Social\',        1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (2,  \'Keynote Address\',      \'09:30\', \'10:30\',        \'Keynote\',       1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (3,  \'COFFEE BREAK\', \'10:30\',        \'11:00\',        \'Social\',        1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (4,  \'TECHNICAL SESSIONS\',   \'11:00\',        \'12:30\',        \'Technical\',     1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (5,  \'LUNCH\',        \'12:30\',        \'14:00\',        \'Social\',        1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (6,  \'TECHNICAL SESSIONS\',   \'14:00\',        \'15:30\',        \'Technical\',     1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (7,  \'TEA BREAK\',    \'15:30\',        \'16:00\',        \'Social\',        1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (8,  \'TECHNICAL SESSIONS\',   \'16:00\',        \'17:30\',        \'Technical\',     1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (9,  \'Computers and Thought Award Lecture\',  \'18:00\',        \'19:00\',        \'Technical\',     1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (10, \'Invited Speaker\',      \'09:00\', \'10:30\',        \'Keynote\',       2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (11, \'COFFEE BREAK\', \'10:30\',        \'11:00\',        \'Social\',        2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (12, \'TECHNICAL SESSIONS\',   \'11:00\',        \'12:30\',        \'Technical\',     2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (13, \'LUNCH\',        \'12:30\',        \'14:00\',        \'Social\',        2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (14, \'TECHNICAL SESSIONS\',   \'14:00\',        \'15:30\',        \'Technical\',     2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (15, \'TEA BREAK\',    \'15:30\',        \'16:00\',        \'Social\',        2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (16, \'TECHNICAL SESSIONS\',   \'16:00\',        \'17:30\',        \'Technical\',     2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (17, \'CONFERENCE BANQUET\',   \'19:00\',        \'22:00\',        \'Social\',        2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (18, \'Invited Talk\', \'09:00\', \'10:30\',        \'Keynote\',       3)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (19, \'COFFEE BREAK\', \'10:30\',        \'11:00\',        \'Social\',        3)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (20, \'TECHNICAL SESSIONS\',   \'11:00\',        \'12:30\',        \'Technical\',     3)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	sessions (_id, title, startTime, endtime, type, dayId) values (21, \'CLOSING CEREMONY\',     \'12:30\',        \'13:00\',        \'Social\',        3)', [], insertSuccess, errorDB);

        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (1,    \'Computer Mediated Transactions\',       1,      2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (2,    \'Cognitive and Philosophical Foundations\',      2,      4)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (3,    \'Performance and Behavior Modeling in Games\',   3,      4)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (4,    \'Diagnosis and Testing\',        4,      4)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (5,    \'Social Choice: Manipulation\',  2,      6)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (6,    \'Search in Games\',      3,      6)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (7,    \'Plan Recognition\',     4,      6)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (8,    \'Online Games\', 2,      8)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (9,    \'Model-Based Diagnosis and Applications\',       3,      8)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (10,   \'Word Sense Disambiguation\',    4,      8)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (11,   \'STAIR: The STanford Artificial Intelligence Robot Project\',    1,      9)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (12,   \'Embodied Language Games with Autonomous Robots\',       1,      10)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (13,   \'Robotics: Multirobot Planning\',        2,      12)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (14,   \'Search And Learning\',  3,      12)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (15,   \'Multiagent Resource Allocation\',       4,      12)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (16,   \'HTN Planning\', 2,      14)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (17,   \'Coalitional Games\',    3,      14)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (18,   \'Unsupervised Learning\',        4,      14)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (19,   \'Heuristic Search\',     2,      16)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (20,   \'Logic Programming\',    3,      16)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (21,   \'Mechanism Design\',     4,      16)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (22,   \'Intelligent Tutoring Systems: New Challenges and Directions\',  1,      18)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (23,   \'Social Choice: Voting\',        2,      20)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (24,   \'Optimal Planning\',     3,      20)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	events (_id, title, venueId, sessionId) values (25,   \'Metric Learning\',      4,      20)', [], insertSuccess, errorDB);

        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (1,	\'Computer Mediated Transactions\',	\'Hal R. Varian\',	\'HalVarian\',	\'HalVarian\', 1)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (2,	\'Is It Enough to Get the Behavior Right? \',	\'Hector Levesque\',	\' \',	\' \', 	2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (3,	\'A Logic for reasoning about Counterfactual Emotions \',	\'Emiliano Lorini\',	\' \',	\' \', 	2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (4,	\'Towards Context Aware Emotional Intelligence in Machines\',	\'Michal Ptaszynski\',	\' \',	\' \', 	2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (5,	\'Modeling Agents through Bounded Rationality Theories \',	\'Avi Rosenfeld\',	\' \',	\' \', 	2)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (6,	\'Analysis of a Winning Computational Billiards Player\',	\'Chris Archibald\',	\' \',	\' \', 	3)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (7,	\'Acquiring Agent-Based Models of Conflict from Event Data \',	\'Glenn Taylor\',	\' \',	\' \', 	3)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (8,	\'Using Reasoning Patterns to Help Humans Solve Complex Games\',	\'Dimitrios Antos\',	\' \',	\' \', 	3)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (9,	\'A New Bayesian Approach to Multiple Intermittent Fault Diagnosis\',	\'Rui Abreu\',	\'  \',	\' \', 	4)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (10,	\'Diagnosing Multiple Persistent and Intermittent Faults\',	\'Johan de Kleer\',	\' \',	\' \', 	4)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (11,	\'FRACTAL: Efficient Fault Isolation Using Active Testing \',	\'Alexander Feldman\',	\' \',	\' \', 	4)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (12,	\'Complexity of Unweighted Coalitional Manipulation under Some Common Voting Rules\',	\'Lirong Xia\',	\' \',	\' \', 	5)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (13,	\'How Hard Is It to Control Sequential Elections via the Agenda?\',	\'Vincent Conitzer\',	\' \',	\' \', 	5)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (14,	\'Multimode Control Attacks on Elections\',	\'Piotr Faliszewski\',	\' \',	\' \', 	5)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (15,	\'Where Are the Really Hard Manipulation Problems? The Phase Transition in Manipulating the Veto Rule\',	\'Toby Walsh\',	\' \',	\' \', 	5)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (16,	\'Evaluating Strategies for Running from the Cops\',	\'Carsten Moldenhauer\',	\' \',	\' \', 	6)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (17,	\'Improving State Evaluation, Inference, and Search in Trick-Based Card Games\',	\'Michael Buro\',	\' \',	\' \', 	6)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (18,	\'Solving 8x8 Hex\',	\'Philip Henderson\',	\' \',	\' \', 	6)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (19,	\'Probabilistic State Translation in Extensive Games with Large Action Sets\',	\'David Schnizlein\',	\' \',	\' \', 	6)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (20,	\'Abnormal Activity Recognition Based on HDP-HMM\',	\'Derek Hao Hu\',	\' \',	\' \', 	7)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (21,	\'Activity Recognition with Intended Actions\',	\'Alfredo Gabaldon\',	\' \',	\' \', 	7)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (22,	\'Plan Recognition as Planning\',	\'Miguel Ramirez\',	\' \',	\' \', 	7)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (23,	\'Delaying Commitment in Plan Recognition Using Combinatory Categorial Grammars\',	\'Chris Geib\',	\' \',	\' \', 	7)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (24,	\'Wikispeedia: An Online Game for Inferring Semantic Distances between Concepts\',	\'Robert West\',	\' \',	\' \', 	8)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (25,	\'On the Tip of My Thought: Playing the Guillotine Game\',	\'Giovanni Semeraro\',	\' \',	\' \', 	8)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (26,	\'Streamlining Attacks on CAPTCHAs with a Computer Game\',	\'Jeff Yan\',	\' \',	\' \', 	8)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (27,	\'Evaluating Abductive Hypotheses using an EM Algorithm on BDDs\',	\'Katsumi Inoue\',	\' \',	\' \', 	9)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (28,	\'Solving Strong-Fault Diagnostic Models by Model Relaxation \',	\'Alex Feldman\',	\' \',	\' \', 	9)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (29,	\'Plausible Repairs for Inconsistent Requirements\',	\'Alex Felfernig\',	\' \',	\' \', 	9)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (30,	\'Knowledge-Based WSD and Specific Domains\',	\'Eneko Agirre\',	\' \',	\' \', 	10)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (31,	\'Word Sense Disambiguation for All Words without Hard Labor\',	\'Zhi Zhong\',	\' \',	\' \', 	10)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (32,	\'Web-Scale N-gram Models for Lexical Disambiguation\',	\'Shane Bergsma\',	\' \',	\' \', 	10)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (33,	\'STAIR: The STanford Artificial Intelligence Robot Project\',	\'Andrew Y. Ng \',	\'AndrewNg\',	\'AndrewNg\', 11)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (34,	\'Embodied Language Games with Autonomous Robots\',	\'Luc Steels \',	\'LucSteels\',	\'LucSteels\', 12)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (35,	\'Adversarial Uncertainty in Multi-Robot Patrol\',	\'Noa Agmon\',	\' \',	\' \', 	13)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (36,	\'Algorithms and Complexity Results for Pursuit-Evasion Problems\',	\'Richard Borie\',	\' \',	\' \', 	13)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (37,	\'Tractable Multi-Agent Path Planning on Grid Maps\',	\'Ko-Hsin Cindy Wang\',	\' \',	\' \', 	13)', [], insertSuccess, errorDB);
        tx.executeSql('insert into talks (_id, title, speaker, image, description, eventId) values (38,	\'A Distributed Control Loop for Autonomous Recovery in a Multi-Agent Plan\',	\'Roberto Micalizio\',	\' \',	\' \', 	13)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (39,	\'Efficient Dominant Point Algorithms for the MLCS Problem\',	\'Qingguo Wang\',	\' \',	\' \', 	14)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (40,	\'Search Strategies for an Anytime Usage of the Branch and Prune Algorithm\',	\'Raphael Chenouard\',	\' \',	\' \', 	14)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (41,	\'Goal-Driven Learning in the GILA Integrated Intelligence Architecture\',	\'Jainarayan Radhakrishnan\',	\' \',	\' \', 	14)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (42,	\'Angluin-Style Learning of NFA\',	\'Benedikt Bollig\',	\' \',	\' \', 	14)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (43,	\'Expressive Power-Based Resource Allocation for Data Centers\',	\'Benjamin Lubin\',	\' \',	\' \', 	15)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (44,	\'Online Stochastic Optimization in the Large: Application to Kidney Exchange\',	\'Pranjal Awasthi\',	\' \',	\' \', 	15)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (45,	\'K-Swaps: Cooperative Negotiation for Solving Task-Allocation Problems\',	\'Xiaoming Zheng\',	\' \',	\' \', 	15)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (46,	\'A Multi-Agent Learning Approach to Online Distributed Resource Allocation\',	\'Chongjie Zhang\',	\' \',	\' \', 	15)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (47,	\'Learning Probabilistic Hierarchical Task Networks to Capture User Preferences\',	\'Nan Li\',	\' \',	\' \', 	16)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (48,	\'Translating HTNs to PDDL\',	\'Ronald Alford\',	\' \',	\' \', 	16)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (49,	\'HTN Planning with Preferences\',	\'Shirin Sohrabi\',	\' \',	\' \', 	16)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (50,	\'Learning HTN Method Preconditions and Action Models from Partial Observations\',	\'Hankz Hankui Zhuo\',	\' \',	\' \', 	16)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (51,	\'On the Complexity of Compact Coalitional Games\',	\'Gianluigi Greco\',	\' \',	\' \', 	17)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (52,	\'Coalitional Affinity Games and the Stability Gap\',	\'Simina Branzei\',	\' \',	\' \', 	17)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (53,	\'Simple Coalitional Games with Beliefs\',	\'Georgios Chalkiadakis\',	\' \',	\' \', 	17)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (54,	\'Coalition Structure Generation in Multi-Agent Systems with Positive and Negative Externalities\',	\'Talal Rahwan\',	\' \',	\' \', 	17)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (55,	\'On the Equivalence between Canonical Correlation Analysis and Orthonormalized Partial Least Squares\',	\'Liang Sun\',	\' \',	\' \', 	18)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (56,	\'Relation Regularized Matrix Factorization \',	\'Wu-Jun Li\',	\' \',	\' \', 	18)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (57,	\'Spectral Embedded Clustering\',	\'Feiping Nie\',	\' \',	\' \', 	18)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (58,	\'Knowledge Driven Dimension Reduction for Clustering\',	\'Ian Davidson\',	\' \',	\' \', 	18)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (59,	\'Canadian Traveler Problem With Remote Sensing\',	\'Zahy Bnaya\',	\' \',	\' \', 	19)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (60,	\'Minimum Proof Graphs and Fastest-Cut-First Search Heuristic\',	\'Timothy Furtak\',	\' \',	\' \', 	19)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (61,	\'Memory-Based Heuristics for Explicit State Spaces\',	\'Nathan Sturtevant\',	\' \',	\' \', 	19)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (62,	\'Incremental Phi*: Incremental Any-Angle Path Planning on Grids\',	\'Alex Nash\',	\' \',	\' \', 	19)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (63,	\'Local Query Mining in a Probabilistic Prolog\',	\'Angelika Kimmig\',	\' \',	\' \', 	20)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (64,	\'CTPPL: A Continuous Time Probabilistic Programming Language\',	\'Avi Pfeffer\',	\' \',	\' \', 	20)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (65,	\'A Syntax-based Framework for Merging Imprecise Probabilistic Logic Programs\',	\'Anbu Yue\',	\' \',	\' \', 	20)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (66,	\'Next Steps in Propositional Horn Contraction\',	\'Richard Booth\',	\' \',	\' \', 	20)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (67,	\'How Pervasive Is the Myerson-Satterthwaite Impossibility?\',	\'Abraham Othman\',	\' \',	\' \', 	21)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (68,	\'A General Approach to Environment Design with One Agent\',	\'Haoqi Zhang\',	\' \',	\' \', 	21)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (69,	\'Eliciting Honest Reputation Feedback in a Markov Setting\',	\'Jens Witkowski\',	\' \',	\' \', 	21)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (70,	\'Strategyproof Classification with Shared Inputs\',	\'Reshef Meir\',	\' \',	\' \', 	21)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (71,	\'Intelligent Tutoring Systems: New Challenges and Directions\',	\'Cristina Conati \',	\'ChristinaConati\',	\'ChristinaConati\', 22)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (72,	\'Finite Local Consistency Characterizes Generalized Scoring Rules\',	\'Lirong Xia\',	\' \',	\' \', 	23)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (73,	\'Nonmanipulable Selections from a Tournament\',	\'Alon Altman\',	\' \',	\' \', 	23)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (74,	\'A Dichotomy Theorem on the Existence of Efficient or Neutral Sequential Voting Correspondences\',	\'Lirong Xia\',	\' \',	\' \', 	23)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (75,	\'A Multivariate Complexity Analysis of Determining Possible Winners Given Incomplete Votes\',	\'Nadja Betzler\',	\' \',	\' \', 	23)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (76,	\'Optimal Symbolic Planning with Action Costs and Preferences\',	\'Stefan Edelkamp\',	\' \',	\' \', 	24)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (77,	\'Planning with Partial Preference Models\',	\'Tuan A. Nguyen\',	\' \',	\' \', 	24)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (78,	\'Completeness and Optimality Preserving Reduction for Planning\',	\'Yixin Chen\',	\' \',	\' \', 	24)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (79,	\'Cost-Optimal Planning with Landmarks\',	\'Erez Karpas\',	\' \',	\' \', 	24)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (80,	\'Robust Distance Metric Learning with Auxiliary Knowledge\',	\'Zheng-Jun Zha\',	\' \',	\' \', 	25)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (81,	\'Non-Metric Label Propagation\',	\'Yin Zhang\',	\' \',	\' \', 	25)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (82,	\'Spectral Kernel Learning for Semi-Supervised Classification\',	\'Wei Liu\',	\' \',	\' \', 	25)', [], insertSuccess, errorDB);
        tx.executeSql('insert into	talks (_id, title, speaker, image, description, eventId) values (83,	\'Semi-Supervised Metric Learning Using Pairwise Constraints\',	\'Mahdieh Baghshah\',	\' \',	\' \', 	25)', [], insertSuccess, errorDB);

        tx.executeSql('insert into	venues (_id, name, latitude, longitude) values (1,	\'Computer Science Reception\',	\'52.416258\', \'-4.065607\')', [], insertSuccess, errorDB);
        tx.executeSql('insert into	venues (_id, name, latitude, longitude) values (2,	\'Arts Centre\',	\'52.415574\', \'-4.063021\')', [], insertSuccess, errorDB);
        tx.executeSql('insert into	venues (_id, name, latitude, longitude) values (3,	\'Geography Tower\', 	\'52.416706\', \'-4.066612\')', [], insertSuccess, errorDB);
        tx.executeSql('insert into	venues (_id, name, latitude, longitude) values (4,	\'Hugh Owen\',	\'52.415875\', \'-4.063686\')', [], insertSuccess, errorDB);
    }

    var createSuccess = function (tx, results) {
        console.log("Created table");
    }

    var insertSuccess = function (tx, results) {
        console.log("Insert ID = " + results.insertId);
    }

    var successPopulate = function () {

    }

    var errorDB = function (err) {
        console.log("Error processing SQL: " + err.code);
    }

    var initialise_database = function () {
        // We open any existing database with this name and from the same origin.
        // Check first that openDatabase is supported.
        // Note that if not supported natively and we are running on a mobile
        // then PhoneGap will provide the support.
        if (typeof window.openDatabase === "undefined") {
            return false;
        }
        db = window.openDatabase(DATABASE_NAME, "", "Conference App", 200000);

        // If the version is empty then we know it's the first create so set the version
        // and populate
        if (db.version.length == 0) {
            db.changeVersion("", DATABASE_VERSION);
            db.transaction(populateDB, errorDB, successPopulate);
        }
        else if (db.version == OLD_DATABASE_VERSION) {
            // We can upgrade but in this example we don't!
            alert("upgrading database");
        }
        else if (db.version != DATABASE_VERSION) {
            // Trouble. They have a version of the database we
            // cannot upgrade from
            alert("incompatible database version");
            return false;
        }

        return true;
    }

    var init = function () {
        return initialise_database();
    };

    var queryListSuccess = function (tx, results) {
        var list = [];
        var len = results.rows.length;
        for (var i = 0; i < len; i++) {
            list[i] = results.rows.item(i);
        }
        // After asynchronously obtaining the data we call the processor provided
        // by the caller, e.g. it could be a UI renderer
        processorFunc(list);
    }


    var querySessions = function (tx) {
        // For the moment we just deal with the first day
        tx.executeSql("SELECT * FROM sessions WHERE sessions.dayid = '1' ORDER BY sessions.starttime ASC",
            [], queryListSuccess, errorDB);
    }

    var processSessionsList = function (processor) {
        processorFunc = processor;
        if (db) {
            db.transaction(querySessions, errorDB);
        }
    };

    var pub = {
        init:init,
        processSessionsList:processSessionsList
    };

    return pub;
}(jQuery));